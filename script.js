// localStorage key for video data
const VIDEO_DATA_KEY = 'amos_portfolio_videos';

// Initialize video data
function initVideoData() {
    if (!localStorage.getItem(VIDEO_DATA_KEY)) {
        const defaultVideos = {
            'dQw4w9WgXcQ': { likes: 0, dislikes: 0, rating: 0, ratingCount: 0, comments: [] },
            'jNQXAC9IVRw': { likes: 0, dislikes: 0, rating: 0, ratingCount: 0, comments: [] },
            '9bZkp7q19f0': { likes: 0, dislikes: 0, rating: 0, ratingCount: 0, comments: [] },
            'ZonvMhT5c6Q': { likes: 0, dislikes: 0, rating: 0, ratingCount: 0, comments: [] }
        };
        localStorage.setItem(VIDEO_DATA_KEY, JSON.stringify(defaultVideos));
    }
}

// Get current video ID
let currentVideoId = '';

// Video modal functions
function openVideoModal(videoId, title, stats) {
    currentVideoId = videoId;
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    const titleEl = document.getElementById('modalVideoTitle');
    const statsEl = document.getElementById('modalVideoStats');
    
    player.src = `https://www.youtube.com/embed/${videoId}`;
    titleEl.textContent = title;
    statsEl.textContent = stats;
    
    modal.style.display = 'flex';
    loadVideoData(videoId);
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'none';
    currentVideoId = '';
}

// Rating system
function setRating(stars) {
    const videoData = JSON.parse(localStorage.getItem(VIDEO_DATA_KEY));
    
    if (!videoData[currentVideoId]) {
        videoData[currentVideoId] = { likes: 0, dislikes: 0, rating: 0, ratingCount: 0, comments: [] };
    }
    
    videoData[currentVideoId].rating = (videoData[currentVideoId].rating * videoData[currentVideoId].ratingCount + stars) / (videoData[currentVideoId].ratingCount + 1);
    videoData[currentVideoId].ratingCount += 1;
    
    localStorage.setItem(VIDEO_DATA_KEY, JSON.stringify(videoData));
    updateRatingDisplay();
}

function updateRatingDisplay() {
    const videoData = JSON.parse(localStorage.getItem(VIDEO_DATA_KEY));
    const data = videoData[currentVideoId] || { rating: 0, ratingCount: 0 };
    const avgRating = data.rating ? data.rating.toFixed(1) : 0;
    const stars = document.querySelectorAll('#starRating .fa-star');
    
    stars.forEach((star, index) => {
        if (index < avgRating) {
            star.style.color = '#ff6b6b';
        } else {
            star.style.color = '#666';
        }
    });
    
    const ratingText = document.getElementById('ratingText');
    ratingText.textContent = data.ratingCount > 0 
        ? `${avgRating} ⭐ (${data.ratingCount} rating${data.ratingCount > 1 ? 's' : ''})` 
        : 'No rating';
}

// Like/Dislike system
function likeVideo() {
    const videoData = JSON.parse(localStorage.getItem(VIDEO_DATA_KEY));
    
    if (!videoData[currentVideoId]) {
        videoData[currentVideoId] = { likes: 0, dislikes: 0, rating: 0, ratingCount: 0, comments: [] };
    }
    
    videoData[currentVideoId].likes += 1;
    localStorage.setItem(VIDEO_DATA_KEY, JSON.stringify(videoData));
    document.getElementById('likeCount').textContent = videoData[currentVideoId].likes;
}

function dislikeVideo() {
    const videoData = JSON.parse(localStorage.getItem(VIDEO_DATA_KEY));
    
    if (!videoData[currentVideoId]) {
        videoData[currentVideoId] = { likes: 0, dislikes: 0, rating: 0, ratingCount: 0, comments: [] };
    }
    
    videoData[currentVideoId].dislikes += 1;
    localStorage.setItem(VIDEO_DATA_KEY, JSON.stringify(videoData));
    document.getElementById('dislikeCount').textContent = videoData[currentVideoId].dislikes;
}

// Comment system
function addComment() {
    const inputField = document.getElementById('commentInputField');
    const commentText = inputField.value.trim();
    
    if (!commentText) return;
    
    const videoData = JSON.parse(localStorage.getItem(VIDEO_DATA_KEY));
    
    if (!videoData[currentVideoId]) {
        videoData[currentVideoId] = { likes: 0, dislikes: 0, rating: 0, ratingCount: 0, comments: [] };
    }
    
    const comment = {
        author: 'You',
        text: commentText,
        likes: 0,
        timestamp: new Date().toLocaleString()
    };
    
    videoData[currentVideoId].comments.push(comment);
    localStorage.setItem(VIDEO_DATA_KEY, JSON.stringify(videoData));
    
    inputField.value = '';
    displayComments();
}

function likeComment(element) {
    const likeCountEl = element.querySelector('.like-count');
    let likes = parseInt(likeCountEl.textContent) || 0;
    likes++;
    likeCountEl.textContent = likes;
}

function displayComments() {
    const videoData = JSON.parse(localStorage.getItem(VIDEO_DATA_KEY));
    const data = videoData[currentVideoId] || { comments: [] };
    const commentsList = document.getElementById('commentsList');
    
    const defaultComments = [
        { author: 'John Doe', text: 'Great content! Really helpful.', likes: 5 },
        { author: 'Sarah Smith', text: 'Amazing work! Keep it up!', likes: 12 },
        { author: 'Mike Johnson', text: 'This helped me a lot. Thank you!', likes: 8 }
    ];
    
    let commentsHTML = '';
    
    // Add default comments
    defaultComments.forEach(comment => {
        commentsHTML += `
            <div class="comment">
                <p class="comment-author">${comment.author}</p>
                <p class="comment-text">${comment.text}</p>
                <div class="comment-actions">
                    <span onclick="likeComment(this)">👍 <span class="like-count">${comment.likes}</span></span>
                    <span>Reply</span>
                </div>
            </div>
        `;
    });
    
    // Add user comments
    if (data.comments && data.comments.length > 0) {
        data.comments.forEach(comment => {
            commentsHTML += `
                <div class="comment">
                    <p class="comment-author">${comment.author}</p>
                    <p class="comment-text">${comment.text}</p>
                    <div class="comment-actions">
                        <span onclick="likeComment(this)">👍 <span class="like-count">${comment.likes}</span></span>
                        <span>Reply</span>
                    </div>
                </div>
            `;
        });
    }
    
    commentsList.innerHTML = commentsHTML;
    document.getElementById('commentCount').textContent = (data.comments ? data.comments.length : 0) + defaultComments.length;
}

function loadVideoData(videoId) {
    const videoData = JSON.parse(localStorage.getItem(VIDEO_DATA_KEY));
    const data = videoData[videoId] || { likes: 0, dislikes: 0, rating: 0, ratingCount: 0, comments: [] };
    
    document.getElementById('likeCount').textContent = data.likes;
    document.getElementById('dislikeCount').textContent = data.dislikes;
    updateRatingDisplay();
    displayComments();
}

function toggleSuggestions() {
    const suggestionsPanel = document.getElementById('videoSuggestions');
    suggestionsPanel.style.display = suggestionsPanel.style.display === 'none' ? 'block' : 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('videoModal');
    if (e.target === modal) {
        closeVideoModal();
    }
});

// Initialize
initVideoData();