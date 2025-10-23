#!/bin/bash

# Face-API.js Models Downloader
# This script downloads all required face recognition models

echo "📥 Downloading Face-API.js Models..."

cd "$(dirname "$0")/public/models" || exit

# Base URL
BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# Models to download
MODELS=(
  "tiny_face_detector_model-weights_manifest.json"
  "tiny_face_detector_model-shard1"
  "face_landmark_68_model-weights_manifest.json"
  "face_landmark_68_model-shard1"
  "face_landmark_68_tiny_model-weights_manifest.json"
  "face_landmark_68_tiny_model-shard1"
  "face_recognition_model-weights_manifest.json"
  "face_recognition_model-shard1"
  "face_recognition_model-shard2"
  "face_expression_model-weights_manifest.json"
  "face_expression_model-shard1"
  "ssd_mobilenetv1_model-weights_manifest.json"
  "ssd_mobilenetv1_model-shard1"
  "ssd_mobilenetv1_model-shard2"
  "age_gender_model-weights_manifest.json"
  "age_gender_model-shard1"
)

# Download each model
for model in "${MODELS[@]}"; do
  echo "Downloading $model..."
  curl -L -o "$model" "$BASE_URL/$model"
done

echo "✅ All models downloaded successfully!"
echo "📁 Models location: $(pwd)"

