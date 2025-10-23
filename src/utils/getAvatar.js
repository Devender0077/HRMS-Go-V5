// ----------------------------------------------------------------------

/**
 * Get a local avatar image path
 * @param {number} index - Avatar index (1-25)
 * @returns {string} - Path to avatar image
 */
export function getAvatar(index = 1) {
  const avatarIndex = ((index - 1) % 25) + 1; // Ensure index is between 1-25
  return `/assets/images/avatar/avatar-${avatarIndex}.webp`;
}

/**
 * Get avatar based on name (consistent avatar for same name)
 * @param {string} name - User name
 * @returns {string} - Path to avatar image
 */
export function getAvatarByName(name = '') {
  if (!name) return getAvatar(1);
  
  // Create a simple hash from the name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = (hash % 25) + 1;
  
  return getAvatar(index);
}

/**
 * Get a random avatar
 * @returns {string} - Path to random avatar image
 */
export function getRandomAvatar() {
  const index = Math.floor(Math.random() * 25) + 1;
  return getAvatar(index);
}

