// Global variable to track currently playing video
    let currentPlayingVideo = null;
    let progressUpdateIntervals = {};
    
    function flipCard(card) {
      // First close any already open cards
      const allCards = document.querySelectorAll('.card');
      allCards.forEach(c => {
        if (c !== card && c.classList.contains('flipped')) {
          c.classList.remove('flipped');
          // Pause any video in the card being closed
          const video = c.querySelector('video');
          if (video) {
            video.pause();
            clearInterval(progressUpdateIntervals[video.id]);
          }
        }
      });
      
      // Toggle the clicked card
      card.classList.toggle('flipped');
      
      // Scroll to center the card
      if (card.classList.contains('flipped')) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Pause video when card is flipped back
        const video = card.querySelector('video');
        if (video) {
          video.pause();
          clearInterval(progressUpdateIntervals[video.id]);
        }
      }
    }
    
    function playVideo(button) {
      const card = button.closest('.card');
      const video = card.querySelector('video');
      
      // Pause any currently playing video
      if (currentPlayingVideo && currentPlayingVideo !== video) {
        currentPlayingVideo.pause();
        clearInterval(progressUpdateIntervals[currentPlayingVideo.id]);
      }
      
      video.play();
      currentPlayingVideo = video;
      
      // Start progress updates
      startProgressUpdate(video);
    }
    
    function pauseVideo(button) {
      const card = button.closest('.card');
      const video = card.querySelector('video');
      video.pause();
      if (currentPlayingVideo === video) {
        currentPlayingVideo = null;
      }
      clearInterval(progressUpdateIntervals[video.id]);
    }
    
    function seekVideo(slider) {
      const video = slider.closest('.card-back').querySelector('video');
      const percent = slider.value;
      video.currentTime = (percent / 100) * video.duration;
    }
    
    function startProgressUpdate(video) {
      const cardBack = video.closest('.card-back');
      const progressBar = cardBack.querySelector('.progress-bar');
      const timeDisplay = cardBack.querySelector('.time-display');
      
      // Clear any existing interval for this video
      clearInterval(progressUpdateIntervals[video.id]);
      
      // Update immediately
      updateProgress();
      
      // Set up interval for updates
      progressUpdateIntervals[video.id] = setInterval(updateProgress, 200);
      
      function updateProgress() {
        if (!isNaN(video.duration) && video.duration > 0) {
          const progress = (video.currentTime / video.duration) * 100;
          progressBar.value = progress;
          
          // Format time display
          const currentTime = formatTime(video.currentTime);
          const duration = formatTime(video.duration);
          timeDisplay.textContent = `${currentTime} / ${duration}`;
        }
      }
    }
    
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    function closeCard(card) {
      // Pause video when closing
      const video = card.querySelector('video');
      if (video) {
        video.pause();
        clearInterval(progressUpdateIntervals[video.id]);
      }
      if (currentPlayingVideo === video) {
        currentPlayingVideo = null;
      }
      
      card.classList.remove('flipped');
    }
    
    function closeAllCards() {
      document.querySelectorAll('.card').forEach(card => {
        // Pause all videos when closing all cards
        const video = card.querySelector('video');
        if (video) {
          video.pause();
          clearInterval(progressUpdateIntervals[video.id]);
        }
        
        card.classList.remove('flipped');
      });
      currentPlayingVideo = null;
    }
    
    // Close card when clicking outside
    document.addEventListener('click', function(event) {
      const cards = document.querySelectorAll('.card');
      let clickedOnCard = false;
      
      cards.forEach(card => {
        if (card.contains(event.target)) {
          clickedOnCard = true;
        }
      });
      
      if (!clickedOnCard) {
        closeAllCards();
      }
    });
    
    // Initialize video IDs for progress tracking
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('video').forEach((video, index) => {
        video.id = 'video-' + index;
      });
    });