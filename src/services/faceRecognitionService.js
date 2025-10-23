import * as faceapi from 'face-api.js';
import { FACE_RECOGNITION } from '../config-global';

// Face Recognition Service
class FaceRecognitionService {
  constructor() {
    this.isModelLoaded = false;
    this.confidenceThreshold = FACE_RECOGNITION.confidenceThreshold;
    this.modelPath = '/models'; // Path to face-api.js models
  }

  /**
   * Load face-api.js models
   */
  async loadModels() {
    if (this.isModelLoaded) {
      return true;
    }

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(this.modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(this.modelPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(this.modelPath),
        faceapi.nets.faceExpressionNet.loadFromUri(this.modelPath),
      ]);

      this.isModelLoaded = true;
      console.log('Face recognition models loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading face recognition models:', error);
      throw new Error('Failed to load face recognition models');
    }
  }

  /**
   * Detect face in image
   * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} input - Input element
   * @returns {Promise<Object>} Face detection result
   */
  async detectFace(input) {
    if (!this.isModelLoaded) {
      await this.loadModels();
    }

    try {
      const detection = await faceapi
        .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()
        .withFaceExpressions();

      if (!detection) {
        return {
          success: false,
          message: 'No face detected in the image',
        };
      }

      return {
        success: true,
        detection,
        descriptor: detection.descriptor,
        landmarks: detection.landmarks,
        expressions: detection.expressions,
      };
    } catch (error) {
      console.error('Error detecting face:', error);
      throw error;
    }
  }

  /**
   * Register/Enroll a face
   * @param {HTMLImageElement|HTMLVideoElement} input - Input element
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Registration result
   */
  async registerFace(input, userId) {
    try {
      const result = await this.detectFace(input);

      if (!result.success) {
        return result;
      }

      // Store face descriptor in local storage or backend
      const faceData = {
        userId,
        descriptor: Array.from(result.descriptor),
        timestamp: new Date().toISOString(),
      };

      // Store in localStorage (in production, send to backend)
      const storedFaces = this.getStoredFaces();
      storedFaces[userId] = faceData;
      localStorage.setItem('face_descriptors', JSON.stringify(storedFaces));

      return {
        success: true,
        message: 'Face registered successfully',
        faceData,
      };
    } catch (error) {
      console.error('Error registering face:', error);
      return {
        success: false,
        message: 'Failed to register face',
        error: error.message,
      };
    }
  }

  /**
   * Verify/Authenticate face
   * @param {HTMLImageElement|HTMLVideoElement} input - Input element
   * @param {string} userId - User ID to verify against (optional)
   * @returns {Promise<Object>} Verification result
   */
  async verifyFace(input, userId = null) {
    try {
      const result = await this.detectFace(input);

      if (!result.success) {
        return result;
      }

      const storedFaces = this.getStoredFaces();

      if (Object.keys(storedFaces).length === 0) {
        return {
          success: false,
          message: 'No registered faces found',
        };
      }

      // Create labeled face descriptors
      const labeledDescriptors = Object.entries(storedFaces).map(
        ([id, faceData]) =>
          new faceapi.LabeledFaceDescriptors(id, [new Float32Array(faceData.descriptor)])
      );

      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, this.confidenceThreshold);

      const bestMatch = faceMatcher.findBestMatch(result.descriptor);

      if (bestMatch.label === 'unknown') {
        return {
          success: false,
          message: 'Face not recognized',
          confidence: 0,
        };
      }

      // If userId is provided, verify it matches
      if (userId && bestMatch.label !== userId) {
        return {
          success: false,
          message: 'Face does not match the provided user',
          matchedUserId: bestMatch.label,
          confidence: 1 - bestMatch.distance,
        };
      }

      return {
        success: true,
        message: 'Face verified successfully',
        userId: bestMatch.label,
        confidence: 1 - bestMatch.distance,
        distance: bestMatch.distance,
      };
    } catch (error) {
      console.error('Error verifying face:', error);
      return {
        success: false,
        message: 'Failed to verify face',
        error: error.message,
      };
    }
  }

  /**
   * Get stored face descriptors
   * @returns {Object} Stored faces
   */
  getStoredFaces() {
    try {
      const stored = localStorage.getItem('face_descriptors');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting stored faces:', error);
      return {};
    }
  }

  /**
   * Delete registered face
   * @param {string} userId - User ID
   * @returns {boolean} Success status
   */
  deleteFace(userId) {
    try {
      const storedFaces = this.getStoredFaces();
      delete storedFaces[userId];
      localStorage.setItem('face_descriptors', JSON.stringify(storedFaces));
      return true;
    } catch (error) {
      console.error('Error deleting face:', error);
      return false;
    }
  }

  /**
   * Check if user has registered face
   * @param {string} userId - User ID
   * @returns {boolean} Has registered face
   */
  hasFaceRegistered(userId) {
    const storedFaces = this.getStoredFaces();
    return !!storedFaces[userId];
  }

  /**
   * Capture image from video stream
   * @param {HTMLVideoElement} video - Video element
   * @returns {Promise<Blob>} Image blob
   */
  async captureImageFromVideo(video) {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to capture image'));
          }
        }, 'image/jpeg');
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Draw detection box on canvas
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Object} detection - Face detection result
   */
  drawDetection(canvas, detection) {
    if (!detection) return;

    const displaySize = {
      width: canvas.width,
      height: canvas.height,
    };

    faceapi.matchDimensions(canvas, displaySize);

    const resizedDetections = faceapi.resizeResults(detection, displaySize);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }

  /**
   * Initialize webcam
   * @returns {Promise<MediaStream>} Media stream
   */
  async initializeWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      return stream;
    } catch (error) {
      console.error('Error accessing webcam:', error);
      throw new Error('Failed to access webcam. Please check permissions.');
    }
  }

  /**
   * Stop webcam stream
   * @param {MediaStream} stream - Media stream to stop
   */
  stopWebcam(stream) {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  /**
   * Check if face recognition is enabled
   * @returns {boolean} Enabled status
   */
  isEnabled() {
    return FACE_RECOGNITION.enabled;
  }

  /**
   * Update confidence threshold
   * @param {number} threshold - New threshold (0-1)
   */
  setConfidenceThreshold(threshold) {
    this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
  }
}

export default new FaceRecognitionService();

