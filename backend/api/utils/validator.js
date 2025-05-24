const validator = {
  /**
   * Validates university email domains for Bangladesh
   * @param {string} v - Email address
   * @returns {boolean} - True if valid university email
   */
  isUniversityEmail: (v) => {
    const universityDomains = [
      'ut-dhaka\\.edu',
      'du\\.ac\\.bd',
      'cu\\.ac\\.bd',
      'ku\\.ac\\.bd',
      'ru\\.ac\\.bd',
      'ju\\.ac\\.bd',
      'nstu\\.edu\\.bd',
      'bracu\\.ac\\.bd',
      'nsu\\.edu\\.bd',
      'aiub\\.edu',
      'ewubd\\.edu',
      'iub\\.edu\\.bd',
      'aust\\.edu',
      'uoda\\.edu\\.bd',
      'diu\\.edu\\.bd',
      'uap-bd\\.edu',
      'uiu\\.ac\\.bd',
      'sau\\.edu\\.bd',
      'lus\\.ac\\.bd',
      'sub\\.edu\\.bd',
      'pstu\\.ac\\.bd',
      'hstu\\.ac\\.bd',
      'mstu\\.edu\\.bd',
      'bsmrstu\\.edu\\.bd',
      'bup\\.edu\\.bd',
      'duet\\.ac\\.bd',
      'just\\.edu\\.bd',
      'ruet\\.ac\\.bd',
      'kuet\\.ac\\.bd',
      'cuet\\.ac\\.bd',
      'buet\\.ac\\.bd'
    ];
    const pattern = new RegExp(`@(${universityDomains.join('|')})$`, 'i');
    return pattern.test(v);
  },

  /**
   * Validates Bangladeshi phone numbers
   * @param {string} v - Phone number
   * @returns {boolean} - True if valid BD number
   */
  isBangladeshiPhone: (v) => {
    // Matches: 01XXXXXXXXX, +8801XXXXXXXXX, 8801XXXXXXXXX
    const pattern = /^(?:\+?88)?01[3-9]\d{8}$/;
    return pattern.test(v);
  },

  /**
   * Validates if user is university-aged (16+ years)
   * @param {Date|string} v - Date of birth
   * @returns {boolean} - True if 16+ years old
   */
  isUniversityAge: (v) => {
    const dob = new Date(v);
    if (isNaN(dob.getTime())) return false; // Invalid date

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age >= 16;
  }
};

module.exports = validator;