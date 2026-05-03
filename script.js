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

// Admin helpers - browser-side Google Sign-In with Drive API
let gapiInitialized = false;
let userEmail = null;
const ADMIN_EMAIL = 'sirrubiaamos@gmail.com';

async function initGapi() {
  if (gapiInitialized) return;
  return new Promise((resolve) => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          clientId: window.GOOGLE_CLIENT_ID || '',
          scope: 'https://www.googleapis.com/auth/drive'
        });
        gapiInitialized = true;
        resolve();
      } catch (e) {
        console.error('gapi init err', e);
        resolve();
      }
    });
  });
}

async function isAdmin() {
  await initGapi();
  const auth2 = gapi.auth2.getAuthInstance();
  if (!auth2) return false;
  const isSignedIn = auth2.isSignedIn.get();
  if (!isSignedIn) return false;
  const profile = auth2.currentUser.get().getBasicProfile();
  userEmail = profile.getEmail().toLowerCase();
  return userEmail === ADMIN_EMAIL.toLowerCase();
}

async function serverLogin(secret) {
  // unused in browser-side mode
  return false;
}

async function serverLogout() {
  await initGapi();
  const auth2 = gapi.auth2.getAuthInstance();
  if (auth2) await auth2.signOut();
  userEmail = null;
}

// Google Sign-In via browser
async function adminGoogleSignIn() {
  await initGapi();
  const auth2 = gapi.auth2.getAuthInstance();
  if (!auth2) {
    alert('Google Sign-In not initialized');
    return;
  }
  try {
    await auth2.signIn();
    const profile = auth2.currentUser.get().getBasicProfile();
    const email = profile.getEmail().toLowerCase();
    if (email === ADMIN_EMAIL.toLowerCase()) {
      applyAdminUI();
      alert('Admin logged in');
    } else {
      alert('Not authorized');
      await auth2.signOut();
    }
  } catch (e) {
    console.error('sign in err', e);
    alert('Sign-in failed');
  }
}

// Apply UI visibility for admin-only controls (checks browser auth)
async function applyAdminUI() {
  const admin = await isAdmin();
  const uploadButtons = document.querySelectorAll('.upload-btn');
  uploadButtons.forEach(btn => {
    const txt = (btn.textContent || '').toLowerCase();
    if (txt.includes('upload') || txt.includes('add item') || txt.includes('clear') || txt.includes('reset')) {
      btn.style.display = admin ? '' : 'none';
    }
  });
  renderPortfolioItems();
  const userBtn = document.querySelector('.user-btn');
  if (userBtn) userBtn.title = admin ? 'Logged in (click to logout)' : 'Click to login as admin';
}

// Wire user button to Google Sign-In/logout
document.addEventListener('DOMContentLoaded', () => {
  const userBtn = document.querySelector('.user-btn');
  if (userBtn) {
    userBtn.addEventListener('click', async () => {
      const admin = await isAdmin();
      if (admin) {
        if (confirm('Logout admin?')) { await serverLogout(); applyAdminUI(); }
        return;
      }
      adminGoogleSignIn();
    });
  }
  applyAdminUI();
});

// --- Portfolio categories & document viewer ---
function filterCategory(category) {
    const cards = document.querySelectorAll('.content-card');
    const buttons = document.querySelectorAll('.category-btn');
    // normalize
    category = (category || '').toString().toLowerCase();

    buttons.forEach(btn => btn.classList.remove('active'));
    // highlight a matching button if one exists (All, Videos, Images, Documents, Other)
    const activeBtn = Array.from(buttons).find(b => b.textContent.toLowerCase() === category || (category === 'all' && b.textContent.toLowerCase() === 'all') || (category === 'video' && b.textContent.toLowerCase().includes('video')));
    if (activeBtn) activeBtn.classList.add('active');

    // sync dropdown if present
    const select = document.getElementById('categorySelect');
    if (select) {
        // If select has this value, set it; otherwise leave as-is
        const opt = Array.from(select.options).find(o => o.value.toLowerCase() === category);
        if (opt) select.value = opt.value;
    }
    cards.forEach(card => {
        const cat = (card.getAttribute('data-category') || 'video').toString().toLowerCase();
        if (category === 'all' || cat === category) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Update category dropdown with detected categories/types from stored items
function updateCategoryOptions() {
    const select = document.getElementById('categorySelect');
    if (!select) return;
    const items = getPortfolioItems();
    const existing = new Set(Array.from(select.options).map(o => o.value.toLowerCase()));
    items.forEach(it => {
        const c = (it.category || it.type || 'other').toString().toLowerCase();
        if (!existing.has(c)) {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
            select.appendChild(opt);
            existing.add(c);
        }
    });
}

function openDocModal(type, src, title) {
    // create modal if not exists
    let modal = document.getElementById('docModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'docModal';
        modal.className = 'doc-modal';
        modal.innerHTML = `
            <div class="doc-content">
                <div class="doc-header">
                    <div class="doc-title">${title}</div>
                    <div>
                        <button class="doc-close" id="docCloseBtn">Close ✕</button>
                    </div>
                </div>
                <div class="doc-body" id="docBody"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // close handler
        modal.querySelector('#docCloseBtn').addEventListener('click', closeDocModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeDocModal();
        });
    }

    const body = modal.querySelector('#docBody');
    body.innerHTML = '';

    if (type === 'pdf') {
        // If PDF.js is available, render using canvas and provide simple controls
        if (window.pdfjsLib) {
            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.gap = '10px';
            controls.style.padding = '10px';
            controls.style.background = 'rgba(0,0,0,0.25)';
            controls.style.alignItems = 'center';
            controls.innerHTML = `
                <button id="pdfPrev" style="padding:6px 10px">◀ Prev</button>
                <span id="pdfPageInfo" style="color:#e0e0e0">Page 1 / ?</span>
                <button id="pdfNext" style="padding:6px 10px">Next ▶</button>
            `;

            const canvas = document.createElement('canvas');
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            body.appendChild(controls);
            body.appendChild(canvas);

            // PDF rendering state
            let pdfDoc = null;
            let currentPage = 1;

            const renderPage = (num) => {
                pdfDoc.getPage(num).then(page => {
                    const viewport = page.getViewport({ scale: 1.5 });
                    const context = canvas.getContext('2d');
                    // scale canvas to match viewport
                    const ratio = Math.min(body.clientWidth / viewport.width, body.clientHeight / viewport.height);
                    const scaledViewport = page.getViewport({ scale: 1.5 * ratio });
                    canvas.width = scaledViewport.width;
                    canvas.height = scaledViewport.height;
                    page.render({ canvasContext: context, viewport: scaledViewport });
                    document.getElementById('pdfPageInfo').textContent = `Page ${currentPage} / ${pdfDoc.numPages}`;
                });
            };

            // Load document
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            pdfjsLib.getDocument(src).promise.then(doc => {
                pdfDoc = doc;
                currentPage = 1;
                renderPage(currentPage);
            }).catch(err => {
                body.innerHTML = `<div style="padding:20px;color:#e0e0e0">Failed to load PDF: ${err.message}. <a href="${src}" target="_blank" style="color:#ff6b6b">Open</a></div>`;
            });

            // Controls
            body.querySelector('#pdfPrev').addEventListener('click', () => {
                if (currentPage <= 1) return;
                currentPage -= 1;
                renderPage(currentPage);
            });
            body.querySelector('#pdfNext').addEventListener('click', () => {
                if (currentPage >= pdfDoc.numPages) return;
                currentPage += 1;
                renderPage(currentPage);
            });

        } else {
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.allow = 'fullscreen';
            body.appendChild(iframe);
        }
    } else if (type === 'image') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = title || '';
        body.appendChild(img);
    } else if (type === 'audio') {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = src;
        audio.style.width = '100%';
        body.appendChild(audio);
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.src = src;
        video.style.width = '100%';
        video.style.maxHeight = '70vh';
        video.autoplay = true;
        body.appendChild(video);
    } else {
        // attempt to fetch and show text, otherwise link
        fetch(src).then(resp => {
            if (resp.ok) return resp.text();
            throw new Error('cannot fetch');
        }).then(text => {
            const pre = document.createElement('pre');
            pre.style.padding = '20px';
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.color = '#e0e0e0';
            pre.textContent = text;
            body.appendChild(pre);
        }).catch(() => {
            const div = document.createElement('div');
            div.style.padding = '20px';
            div.style.color = '#e0e0e0';
            div.innerHTML = `Cannot preview this file. <a href="${src}" target="_blank" style="color:#ff6b6b">Open in new tab</a>`;
            body.appendChild(div);
        });
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeDocModal() {
    const modal = document.getElementById('docModal');
    if (modal) {
        // clear body to stop any rendering
        const body = modal.querySelector('#docBody');
        if (body) body.innerHTML = '';
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize category to show all
window.addEventListener('DOMContentLoaded', () => {
    filterCategory('all');
    initPortfolioStorage();
    renderPortfolioItems();
    setupPortfolioUploadHandlers();
    updateCategoryOptions();
    
    // Check for category query parameter from index.html dropdown
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('category');
    if (cat) {
        filterCategory(cat);
    }
});

// Portfolio storage (localStorage)
const PORTFOLIO_KEY = 'amos_portfolio_items';

function initPortfolioStorage() {
    if (!localStorage.getItem(PORTFOLIO_KEY)) {
        // seed with up to 5 sample items organized by category
        const seed = [
            // Videography - Jay Cactus TV examples
            { id: genId(), type: 'video', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Demo Video Production', category: 'videography', timestamp: Date.now() - 86400000 * 3 },
            { id: genId(), type: 'video', src: 'https://www.youtube.com/embed/jNQXAC9IVRw', title: 'Jay Cactus TV Clip 1', category: 'videography', timestamp: Date.now() - 86400000 * 2 },
            // Photography
            { id: genId(), type: 'image', src: 'https://i.pinimg.com/originals/8f/8f/8f/8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f.jpg', title: 'Professional Portrait', category: 'photography', timestamp: Date.now() - 86400000 },
            // Documents
            { id: genId(), type: 'document', src: 'assets/sample.pdf', title: 'Portfolio Documentation', category: 'document', timestamp: Date.now() },
            // Software/Other
            { id: genId(), type: 'other', src: 'assets/sample.txt', title: 'Project Configuration', category: 'other', timestamp: Date.now() - 86400000 * 4 }
        ];
        localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(seed));
    }
}

function genId() {
    return 'it_' + Math.random().toString(36).slice(2,9);
}

function getPortfolioItems() {
    try { return JSON.parse(localStorage.getItem(PORTFOLIO_KEY)) || []; } catch(e) { return []; }
}

function savePortfolioItems(items) {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(items));
}

function renderPortfolioItems() {
    const container = document.getElementById('dynamicGrid');
    if (!container) return;
    const items = getPortfolioItems();
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'content-card';
        const dataCat = (item.category || item.type || 'other').toString().toLowerCase();
        card.setAttribute('data-category', dataCat);
        card.setAttribute('data-title', (item.title || '').toLowerCase());
        // create thumbnail and info
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';

        if (item.type === 'video') {
            // If this is a YouTube/embed URL, show an iframe and open the video modal by id.
            const ytId = extractYouTubeId(item.src);
            if (ytId) {
                thumb.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?controls=0" frameborder="0" allowfullscreen></iframe>`;
                card.addEventListener('click', () => openVideoModal(ytId, item.title || '', ''));
            } else {
                // For uploaded/local or hosted video files, show a muted video preview and open a video viewer modal.
                const videoEl = document.createElement('video');
                videoEl.src = item.src;
                videoEl.preload = 'metadata';
                videoEl.muted = true;
                videoEl.playsInline = true;
                videoEl.style.width = '100%';
                videoEl.style.height = '100%';
                videoEl.style.objectFit = 'cover';
                thumb.appendChild(videoEl);
                card.addEventListener('click', () => openDocModal('video', item.src, item.title || ''));
            }
        } else if (item.type === 'image') {
            const img = document.createElement('img'); img.src = item.src; img.alt = item.title || '';
            thumb.appendChild(img);
            card.addEventListener('click', () => openDocModal('image', item.src, item.title || ''));
        } else if (item.type === 'document') {
            const img = document.createElement('img'); img.src = 'https://i.pinimg.com/originals/1a/1a/1a/1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a.jpg'; img.alt = 'doc';
            thumb.appendChild(img);
            card.addEventListener('click', () => openDocModal('pdf', item.src, item.title || ''));
        } else if (item.type === 'audio') {
            // show a simple audio icon in thumbnail
            thumb.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#e0e0e0;font-size:36px;"><i class="fas fa-music"></i></div>';
            card.addEventListener('click', () => openDocModal('audio', item.src, item.title || ''));
        } else {
            const img = document.createElement('img'); img.src = 'https://i.pinimg.com/originals/3c/3c/3c/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c.jpg'; img.alt = 'file';
            thumb.appendChild(img);
            card.addEventListener('click', () => openDocModal('other', item.src, item.title || ''));
        }

        const info = document.createElement('div'); info.className = 'card-info';
        const displayCat = dataCat === 'videography' ? 'Videography' : dataCat === 'photography' ? 'Photography' : dataCat === 'audio' ? 'Audio Engineering' : (dataCat || '').charAt(0).toUpperCase() + (dataCat || '').slice(1);
        // icon for type
        const typeIcon = item.type === 'image' ? 'fa-file-image' : item.type === 'video' ? 'fa-video' : item.type === 'document' ? 'fa-file-pdf' : item.type === 'audio' ? 'fa-music' : (item.type === 'rar' || item.type === 'zip') ? 'fa-file-archive' : 'fa-file';
        const sizeText = item.size ? ` • ${humanFileSize(item.size)}` : '';
        info.innerHTML = `<h3>${item.title || 'Untitled'}</h3><p class="channel"><i class="fas ${typeIcon}" style="margin-right:8px;color:#ff6b6b"></i>${displayCat}</p><p class="stats">${item.type}${sizeText}</p>`;

        // download button
        const dl = document.createElement('button');
        dl.className = 'action-btn';
        dl.style.marginTop = '8px';
        dl.innerHTML = '<i class="fas fa-download"></i> Download';
        dl.addEventListener('click', (e) => {
            e.stopPropagation();
            // create a link and click it
            const a = document.createElement('a');
            a.href = item.src;
            a.download = item.title || '';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });

        // action menu (delete, edit) - only visible to admin
        card.appendChild(thumb);
        card.appendChild(info);
        card.appendChild(dl);

        if (isAdmin()) {
            const actions = document.createElement('div');
            actions.className = 'card-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'card-action-btn';
            editBtn.style.background = '#2a6fb5';
            editBtn.style.color = 'white';
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editPortfolioItem(item.id);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'card-action-btn';
            deleteBtn.style.background = '#c73e1d';
            deleteBtn.style.color = 'white';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deletePortfolioItem(item.id);
            });

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            card.appendChild(actions);
        }
        container.appendChild(card);
    });

    // maintain visibility according to current category
    const activeBtn = document.querySelector('.category-btn.active');
    if (activeBtn) filterCategory(activeBtn.textContent.toLowerCase());
    // update dropdown options based on items
    updateCategoryOptions();
}function extractYouTubeId(url) {
    // accepts embed or watch URLs
    if (!url) return '';
    const m = url.match(/(?:embed\/|v=)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
}

// Upload modal handlers
function openPortfolioUploadModal() {
    document.getElementById('portfolioUploadModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePortfolioUploadModal() {
    document.getElementById('portfolioUploadModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function setupPortfolioUploadHandlers() {
    const drop = document.getElementById('dropZone');
    const input = document.getElementById('portfolioFileInput');

    if (!drop || !input) return;

    ['dragenter','dragover'].forEach(ev => {
        drop.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); drop.style.borderColor = '#ff6b6b'; });
    });
    ['dragleave','drop'].forEach(ev => {
        drop.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); drop.style.borderColor = '#333'; });
    });

    drop.addEventListener('drop', (e) => {
        const f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) {
            // attach file object to input via DataTransfer (simple approach)
            input.files = e.dataTransfer.files;
        }
    });

    input.addEventListener('change', (e) => {
        // no-op, file will be read on submit
    });
}

async function handlePortfolioUpload() {
    if (!(await isAdmin())) {
        alert('Only the site admin can add portfolio items. Please login as admin to proceed.');
        return;
    }
    const fileInput = document.getElementById('portfolioFileInput');
    const urlInput = document.getElementById('portfolioUrlInput');
    const titleInput = document.getElementById('portfolioTitleInput');
    const category = document.getElementById('portfolioCategory').value;

    let src = '';
    let type = category || 'other';
    const items = getPortfolioItems();

    // Priority: file input > url
    let fileSize;
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        fileSize = file.size || 0;
        // derive type by mime
        if (file.type && file.type.startsWith('image/')) type = 'image';
        else if (file.type === 'application/pdf') type = 'document';
        else if (file.type && file.type.startsWith('video/')) type = 'video';
        else if (file.type && file.type.startsWith('audio/')) type = 'audio';
        else if (file.name.match(/\.(rar|zip|7z)$/i)) type = file.name.match(/\.(rar)$/i) ? 'rar' : 'zip';
        else if (file.name.match(/\.(exe|msi|deb|rpm)$/i)) type = 'software';
        else type = 'other';

        // Upload directly to Google Drive via gapi.client.drive
        try {
            await initGapi();
            const fileMetadata = { name: file.name };
            const media = { mimeType: file.type || 'application/octet-stream', body: file };
            const response = await gapi.client.drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id, webViewLink'
            });
            const fileId = response.result.id;
            // make file publicly readable
            await gapi.client.drive.permissions.create({
                fileId: fileId,
                requestBody: { role: 'reader', type: 'anyone' }
            });
            const meta = await gapi.client.drive.files.get({ fileId: fileId, fields: 'webViewLink' });
            src = meta.result.webViewLink || '';
            if (!src) {
                alert('Upload succeeded but could not get public link');
                return;
            }
        } catch (err) {
            console.error('Drive upload err', err);
            alert('Drive upload failed: ' + String(err));
            return;
        }
    } else if (urlInput.value.trim()) {
        src = normalizeCloudLink(urlInput.value.trim());
        // guess type by extension
        if (src.match(/\.pdf($|\?)/i)) type = 'document';
        else if (src.match(/\.(jpg|jpeg|png|gif)($|\?)/i)) type = 'image';
        else if (src.match(/youtube\.com|youtu\.be/)) type = 'video';
        else if (src.match(/\.(mp3|wav|ogg)($|\?)/i)) type = 'audio';
        else if (src.match(/\.(rar|zip|7z)($|\?)/i)) type = src.match(/\.(rar)$/i) ? 'rar' : (src.match(/\.(zip)$/i) ? 'zip' : 'other');
        else type = 'other';
    } else {
        alert('Please select a file or provide a URL');
        return;
    }

    const title = titleInput.value.trim() || (fileInput.files && fileInput.files[0] ? fileInput.files[0].name : 'Untitled');

    // validate category matches type (prevent photo in videography, etc)
    const normalizedCategory = (category || '').toString().toLowerCase();
    // mapping rules: videography -> video, photography -> image, audio -> audio
    const categoryToType = { 'videography': 'video', 'music': 'video', 'photography': 'image', 'audio': 'audio', 'document': 'document' };
    const expectedType = categoryToType[normalizedCategory] || null;
    if (expectedType && expectedType !== type) {
        alert(`Category "${category}" expects ${expectedType} files. Please select a matching file or change the category.`);
        return;
    }

    // limit to 5 items: remove oldest if necessary
    while (items.length >= 5) items.shift();

    const newItem = { id: genId(), type, src, title, category: normalizedCategory || 'other', timestamp: Date.now() };
    if (typeof fileSize !== 'undefined') newItem.size = fileSize;
    items.push(newItem);
    savePortfolioItems(items);
    renderPortfolioItems();
    updateCategoryOptions();
    closePortfolioUploadModal();
    // clear inputs
    fileInput.value = '';
    urlInput.value = '';
    titleInput.value = '';
}

// Human readable file size
function humanFileSize(size) {
    if (!size && size !== 0) return '';
    const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

// Normalize common cloud links to direct-download/embed URLs when possible
function normalizeCloudLink(url) {
    if (!url) return url;
    // Google Drive share -> direct link
    // formats: https://drive.google.com/file/d/FILEID/view?usp=sharing OR https://drive.google.com/open?id=FILEID
    const gd1 = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (gd1) return `https://drive.google.com/uc?export=download&id=${gd1[1]}`;
    const gd2 = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (gd2) return `https://drive.google.com/uc?export=download&id=${gd2[1]}`;
    const gd3 = url.match(/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/);
    if (gd3) return url; // folder link - cannot normalize to a file

    // Dropbox share -> raw link
    // format: https://www.dropbox.com/s/FILEID/filename?dl=0 -> convert dl=1
    const db = url.match(/dropbox\.com\/(s|sh)\/([A-Za-z0-9]+)/);
    if (db) {
        if (url.indexOf('dl=') === -1) return url + '?dl=1';
        return url.replace('dl=0', 'dl=1');
    }

    return url;
}

// Portfolio management functions
function clearPortfolioItems() {
    if (confirm('Are you sure you want to clear all portfolio items? This cannot be undone.')) {
        localStorage.removeItem(PORTFOLIO_KEY);
        renderPortfolioItems();
        updateCategoryOptions();
    }
}

function resetPortfolioDefaults() {
    if (confirm('Are you sure you want to reset to default items?')) {
        localStorage.removeItem(PORTFOLIO_KEY);
        initPortfolioStorage();
        renderPortfolioItems();
        updateCategoryOptions();
    }
}

// Search functionality
function filterBySearch() {
    const searchTerm = (document.getElementById('searchInput').value || '').toLowerCase();
    const cards = document.querySelectorAll('.content-card');
    cards.forEach(card => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const matches = title.includes(searchTerm);
        const cat = (card.getAttribute('data-category') || '').toLowerCase();
        const activeBtn = document.querySelector('.category-btn.active');
        const selectedCat = activeBtn ? activeBtn.textContent.toLowerCase() : 'all';
        const catMatches = selectedCat === 'all' || cat === selectedCat;
        
        if (matches && catMatches) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Sort functionality
function sortPortfolioItems(sortBy) {
    const items = getPortfolioItems();
    
    if (sortBy === 'date-desc') {
        items.reverse(); // newest first
    } else if (sortBy === 'date-asc') {
        items.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)); // oldest first
    } else if (sortBy === 'name-asc') {
        items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'name-desc') {
        items.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    } else if (sortBy === 'category') {
        items.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }
    
    savePortfolioItems(items);
    renderPortfolioItems();
}

// Delete item
function deletePortfolioItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        let items = getPortfolioItems();
        items = items.filter(it => it.id !== itemId);
        savePortfolioItems(items);
        renderPortfolioItems();
        updateCategoryOptions();
    }
}

// Edit item (title only for now)
function editPortfolioItem(itemId) {
    const items = getPortfolioItems();
    const item = items.find(it => it.id === itemId);
    if (!item) return;
    
    const newTitle = prompt('Edit title:', item.title || '');
    if (newTitle !== null && newTitle.trim()) {
        item.title = newTitle.trim();
        savePortfolioItems(items);
        renderPortfolioItems();
    }
}