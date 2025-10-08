---
title: "📝 Student Feedback Form"
description: "Share your feedback to help us improve our services and facilities"
date: 2024-01-15
layout: "single"
---

</br> 
Your opinion matters! Help us enhance your learning experience by sharing valuable feedback.

</br>
</br>
</br>
{{< raw >}}

<div class="card card-padded max-w-2xl mx-auto">
  <form id="feedbackForm" class="space-y-6">
    <!-- Personal Information -->
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <input type="text" id="name" name="name" required 
               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input type="email" id="email" name="email" required 
               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
        <input type="tel" id="phone" name="phone" required
               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
      </div>
      <div>
        <label for="program" class="block text-sm font-medium text-gray-700 mb-1">Program Interested In *</label>
        <select id="program" name="program" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
          <option value="">Select Program</option>
          <option value="bsc-nursing">B.Sc Nursing</option>
          <option value="gnm">GNM Nursing</option>
        </select>
      </div>
    </div>

    <!-- Feedback Category -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Feedback Category *</label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input type="radio" name="category" value="admission-process" required class="mr-2">
          Admission Process
        </label>
        <label class="flex items-center">
          <input type="radio" name="category" value="website-experience" class="mr-2">
          Website Experience
        </label>
        <label class="flex items-center">
          <input type="radio" name="category" value="counseling" class="mr-2">
          Counseling Session
        </label>
        <label class="flex items-center">
          <input type="radio" name="category" value="facilities" class="mr-2">
          College Facilities
        </label>
        <label class="flex items-center">
          <input type="radio" name="category" value="other" class="mr-2">
          Other
        </label>
      </div>
    </div>

    <!-- Rating -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Overall Satisfaction *</label>
      <div class="flex space-x-2">
        <label class="flex flex-col items-center cursor-pointer">
          <input type="radio" name="rating" value="1" required class="hidden">
          <span class="text-2xl">😞</span>
          <span class="text-xs mt-1">Poor</span>
        </label>
        <label class="flex flex-col items-center cursor-pointer">
          <input type="radio" name="rating" value="2" class="hidden">
          <span class="text-2xl">😐</span>
          <span class="text-xs mt-1">Fair</span>
        </label>
        <label class="flex flex-col items-center cursor-pointer">
          <input type="radio" name="rating" value="3" class="hidden">
          <span class="text-2xl">😊</span>
          <span class="text-xs mt-1">Good</span>
        </label>
        <label class="flex flex-col items-center cursor-pointer">
          <input type="radio" name="rating" value="4" class="hidden">
          <span class="text-2xl">😄</span>
          <span class="text-xs mt-1">Very Good</span>
        </label>
        <label class="flex flex-col items-center cursor-pointer">
          <input type="radio" name="rating" value="5" class="hidden">
          <span class="text-2xl">🤩</span>
          <span class="text-xs mt-1">Excellent</span>
        </label>
      </div>
    </div>

    <!-- Feedback Message -->
    <div>
      <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Your Feedback *</label>
      <textarea id="message" name="message" rows="5" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Please share your detailed feedback, suggestions, or concerns..."></textarea>
    </div>

    <!-- Consent -->
    <div class="flex items-start">
      <input type="checkbox" id="consent" name="consent" required
             class="mt-1 mr-2 rounded focus:ring-primary">
      <label for="consent" class="text-sm text-gray-600">
        I consent to the collection and processing of my personal data for the purpose of improving services. *
      </label>
    </div>

    <!-- Submit Button -->
    <button type="submit" class="btn btn-primary w-full py-3">
      Submit Feedback
    </button>

  </form>

  <div id="thankYouMessage" class="hidden text-center py-8">
    <div class="text-green-500 text-6xl mb-4">✅</div>
    <h3 class="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
    <p class="text-gray-600">Your feedback has been submitted successfully. We appreciate your input!</p>
    <a href="/" class="btn btn-ghost mt-4">Return to Homepage</a>
  </div>
</div>
{{< /raw >}}
</br>
  
## 🔒 Privacy Assurance
</br>
✅ Your feedback is completely anonymous unless you choose to share contact details </br>
✅ We use feedback only for service improvement purposes </br>
✅ No personal information is shared with third parties </br>
✅ You can request feedback deletion anytime </br>
</br>

## 📞 Other Feedback Channels

</br>

**Email:** info@ppnc.in  
**Phone:** +91 9050 402 070  
**In-Person:** Student Grievance Cell, Administrative Block

<script>
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Simple form validation
  const formData = new FormData(this);
  const rating = formData.get('rating');
  
  if (!rating) {
    alert('Please select an overall satisfaction rating');
    return;
  }

  // Show thank you message
  this.style.display = 'none';
  document.getElementById('thankYouMessage').classList.remove('hidden');
  
  // Here you would typically send the data to your server
  console.log('Feedback submitted:', {
    name: formData.get('name'),
    email: formData.get('email'),
    category: formData.get('category'),
    rating: formData.get('rating'),
    message: formData.get('message')
  });
});
</script>
