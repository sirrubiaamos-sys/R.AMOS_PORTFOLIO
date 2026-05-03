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
let currentModalItems = [];
let currentModalIndex = -1;
const PORTFOLIO_TOUR_KEY = 'amos_portfolio_tour_seen';

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

// --- Portfolio categories & document viewer ---
function normalizePortfolioCategory(category, type) {
    const rawCategory = (category || '').toString().toLowerCase().trim();
    const rawType = (type || '').toString().toLowerCase().trim();
    const value = rawCategory || rawType || 'other';

    if (value === 'all') return 'all';
    if (value.includes('video') || value.includes('videography')) return 'videography';
    if (value.includes('image') || value.includes('photo') || value.includes('photography')) return 'photography';
    if (value.includes('music')) return 'music';
    if (value.includes('audio')) return 'audio';
    if (value.includes('document') || value.includes('pdf')) return 'document';
    return 'other';
}

function filterCategory(category) {
    const cards = document.querySelectorAll('.content-card');
    const buttons = document.querySelectorAll('.category-btn');
    // normalize
    category = normalizePortfolioCategory(category);

    buttons.forEach(btn => btn.classList.remove('active'));
    // highlight a matching button if one exists (All, Videos, Images, Documents, Other)
    const activeBtn = Array.from(buttons).find(b => {
        const label = (b.textContent || '').toLowerCase();
        if (category === 'all') return label === 'all';
        if (category === 'videography') return label.includes('video');
        if (category === 'photography') return label.includes('photo');
        if (category === 'audio') return label.includes('audio');
        if (category === 'music') return label.includes('music');
        if (category === 'document') return label.includes('document');
        if (category === 'other') return label.includes('other');
        return false;
    });
    if (activeBtn) activeBtn.classList.add('active');

    // sync dropdown if present
    const select = document.getElementById('categorySelect');
    if (select) {
        // If select has this value, set it; otherwise leave as-is
        const opt = Array.from(select.options).find(o => o.value.toLowerCase() === category);
        if (opt) select.value = opt.value;
    }
    cards.forEach(card => {
        const cat = normalizePortfolioCategory(card.getAttribute('data-category'));
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
        const c = normalizePortfolioCategory(it.category, it.type);
        if (!existing.has(c)) {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
            select.appendChild(opt);
            existing.add(c);
        }
    });
}

function getDocumentKind(src, title) {
    const target = `${src || ''} ${(title || '')}`.toLowerCase();
    if (target.match(/\.pdf($|\?)/)) return 'pdf';
    if (target.match(/\.(doc|docx|odt|rtf)($|\?)/)) return 'word';
    if (target.match(/\.(xls|xlsx|csv|ods)($|\?)/)) return 'sheet';
    if (target.match(/\.(ppt|pptx|odp)($|\?)/)) return 'slides';
    if (target.match(/\.(txt|md|json|xml|yaml|yml|log)($|\?)/)) return 'text';
    return 'generic';
}

function getOfficeViewerUrl(src) {
    if (!src) return '';
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`;
}

function isYouTubeUrl(url) {
    return /youtube\.com|youtu\.be/.test((url || '').toLowerCase());
}

function getSortedPortfolioItems() {
    const categoryOrder = { videography: 1, photography: 2, audio: 3, music: 4, document: 5, other: 6 };
    return getPortfolioItems().slice().sort((a, b) => {
        const catA = normalizePortfolioCategory(a.category, a.type);
        const catB = normalizePortfolioCategory(b.category, b.type);
        if (catA !== catB) return (categoryOrder[catA] || 99) - (categoryOrder[catB] || 99);
        return (b.timestamp || 0) - (a.timestamp || 0);
    });
}

function openPortfolioItemByIndex(index) {
    const items = getSortedPortfolioItems();
    if (!items.length || index < 0 || index >= items.length) return;
    currentModalItems = items;
    currentModalIndex = index;
    const item = items[index];
    const normalizedCategory = normalizePortfolioCategory(item.category, item.type);
    if (item.type === 'video') return openDocModal('video', item.src, item.title || 'Untitled');
    if (item.type === 'image') return openDocModal('image', item.src, item.title || 'Untitled');
    if (item.type === 'document') return openDocModal('document', item.src, item.title || 'Untitled');
    if (item.type === 'audio') return openDocModal(normalizedCategory === 'music' ? 'music' : 'audio', item.src, item.title || 'Untitled');
    return openDocModal('other', item.src, item.title || 'Untitled');
}

function navigateDocItem(step) {
    if (!currentModalItems.length) return;
    const next = currentModalIndex + step;
    if (next < 0 || next >= currentModalItems.length) return;
    openPortfolioItemByIndex(next);
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
                    <div class="doc-title" id="docTitle"></div>
                    <div class="doc-header-actions">
                        <button class="doc-close" id="docPrevBtn">Prev</button>
                        <button class="doc-close" id="docNextBtn">Next</button>
                        <button class="doc-close" id="docOpenNewTabBtn">Open</button>
                        <button class="doc-close" id="docCloseBtn">Close ✕</button>
                    </div>
                </div>
                <div class="doc-body" id="docBody"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // close handler
        modal.querySelector('#docCloseBtn').addEventListener('click', closeDocModal);
        modal.querySelector('#docPrevBtn').addEventListener('click', () => navigateDocItem(-1));
        modal.querySelector('#docNextBtn').addEventListener('click', () => navigateDocItem(1));
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeDocModal();
        });
    }

    const body = modal.querySelector('#docBody');
    const titleEl = modal.querySelector('#docTitle');
    const openNewTabBtn = modal.querySelector('#docOpenNewTabBtn');
    titleEl.textContent = title || 'Preview';
    openNewTabBtn.onclick = () => window.open(src, '_blank', 'noopener,noreferrer');
    body.innerHTML = '';

    const prevBtn = modal.querySelector('#docPrevBtn');
    const nextBtn = modal.querySelector('#docNextBtn');
    prevBtn.disabled = currentModalIndex <= 0;
    nextBtn.disabled = currentModalIndex < 0 || currentModalIndex >= currentModalItems.length - 1;

    if (type === 'video') {
        const wrapper = document.createElement('div');
        wrapper.className = 'doc-media-wrapper';

        if (isYouTubeUrl(src)) {
            const id = extractYouTubeId(src);
            const frame = document.createElement('iframe');
            frame.src = id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : src;
            frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            frame.allowFullscreen = true;
            wrapper.appendChild(frame);
        } else {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            wrapper.appendChild(video);
        }
        body.appendChild(wrapper);
    } else if (type === 'pdf' || type === 'document') {
        // If PDF.js is available, render using canvas and provide simple controls
        const kind = getDocumentKind(src, title);
        if (kind === 'pdf' && window.pdfjsLib) {
            const controls = document.createElement('div');
            controls.className = 'doc-toolbar';
            controls.innerHTML = `
                <button id="pdfPrev" class="doc-tool-btn">◀ Prev</button>
                <span id="pdfPageInfo" class="doc-page-info">Page 1 / ?</span>
                <button id="pdfNext" class="doc-tool-btn">Next ▶</button>
            `;

            const canvas = document.createElement('canvas');
            canvas.className = 'doc-canvas';
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

        } else if (kind === 'word' || kind === 'sheet' || kind === 'slides') {
            const iframe = document.createElement('iframe');
            iframe.src = getOfficeViewerUrl(src);
            iframe.allow = 'fullscreen';
            body.appendChild(iframe);
        } else {
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.allow = 'fullscreen';
            body.appendChild(iframe);
        }
    } else if (type === 'image') {
        const wrap = document.createElement('div');
        wrap.className = 'doc-image-wrap';
        const controls = document.createElement('div');
        controls.className = 'doc-toolbar';
        controls.innerHTML = `
            <button class="doc-tool-btn" id="imgZoomOut">-</button>
            <span class="doc-page-info">Image Viewer</span>
            <button class="doc-tool-btn" id="imgZoomIn">+</button>
        `;
        const img = document.createElement('img');
        img.className = 'doc-image-view';
        img.src = src;
        img.alt = title || '';
        let scale = 1;
        controls.querySelector('#imgZoomIn').addEventListener('click', () => {
            scale = Math.min(3, scale + 0.2);
            img.style.transform = `scale(${scale})`;
        });
        controls.querySelector('#imgZoomOut').addEventListener('click', () => {
            scale = Math.max(0.5, scale - 0.2);
            img.style.transform = `scale(${scale})`;
        });
        wrap.appendChild(img);
        body.appendChild(controls);
        body.appendChild(wrap);
    } else if (type === 'audio' || type === 'music') {
        const wrap = document.createElement('div');
        wrap.className = 'doc-audio-player';
        const icon = document.createElement('div');
        icon.className = 'doc-audio-icon';
        icon.innerHTML = '<i class="fas fa-music"></i>';
        const name = document.createElement('h3');
        name.textContent = title || 'Audio Track';
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = src;
        audio.autoplay = true;
        audio.style.width = '100%';
        const wave = document.createElement('div');
        wave.className = 'audio-wave';
        wave.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>';
        wave.style.animationPlayState = 'running';
        audio.addEventListener('pause', () => wave.classList.add('paused'));
        audio.addEventListener('play', () => wave.classList.remove('paused'));

        wrap.appendChild(icon);
        wrap.appendChild(name);
        wrap.appendChild(wave);
        wrap.appendChild(audio);
        body.appendChild(wrap);
    } else {
        const kind = getDocumentKind(src, title);
        if (kind === 'word' || kind === 'sheet' || kind === 'slides') {
            const iframe = document.createElement('iframe');
            iframe.src = getOfficeViewerUrl(src);
            iframe.allow = 'fullscreen';
            body.appendChild(iframe);
        } else if (kind === 'text') {
            fetch(src).then(resp => {
                if (resp.ok) return resp.text();
                throw new Error('cannot fetch');
            }).then(text => {
                const pre = document.createElement('pre');
                pre.className = 'doc-text-preview';
                pre.textContent = text;
                body.appendChild(pre);
            }).catch(() => {
                const div = document.createElement('div');
                div.className = 'doc-fallback';
                div.innerHTML = `Unable to preview this text file here. <a href="${src}" target="_blank" style="color:#ff6b6b">Open in new tab</a>`;
                body.appendChild(div);
            });
        } else {
            const frame = document.createElement('iframe');
            frame.src = src;
            frame.allow = 'fullscreen';
            frame.onerror = () => {
                body.innerHTML = `<div class="doc-fallback">Preview is not available for this file format in browser. <a href="${src}" target="_blank" style="color:#ff6b6b">Open/Download file</a></div>`;
            };
            body.appendChild(frame);
        }
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
        currentModalItems = [];
        currentModalIndex = -1;
    }
}

function startPortfolioTour() {
    if (localStorage.getItem(PORTFOLIO_TOUR_KEY) === '1') return;
    const steps = [
        { selector: '.nav-left .menu-btn', title: 'Menu', text: 'Use this button to open the sidebar navigation.' },
        { selector: '.nav-right .upload-btn:nth-child(2)', title: 'Add Portfolio Item', text: 'Upload videos, images, docs, and music from here.' },
        { selector: '.category-bar', title: 'Categories', text: 'Filter portfolio by videography, photography, audio, music, documents, and more.' },
        { selector: '#dynamicGrid', title: 'Portfolio Grid', text: 'Click any card to open the professional media viewer with keyboard shortcuts.' }
    ];
    let step = 0;
    const overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    const card = document.createElement('div');
    card.className = 'tour-card';
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const showStep = () => {
        const s = steps[step];
        const el = document.querySelector(s.selector);
        if (!el) {
            step += 1;
            if (step >= steps.length) return finish();
            return showStep();
        }
        document.querySelectorAll('.tour-highlight').forEach(n => n.classList.remove('tour-highlight'));
        el.classList.add('tour-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.innerHTML = `
            <h3>${s.title}</h3>
            <p>${s.text}</p>
            <div class="tour-actions">
                <button id="tourSkipBtn">Skip</button>
                <button id="tourNextBtn">${step === steps.length - 1 ? 'Finish' : 'Next'}</button>
            </div>
        `;
        card.querySelector('#tourSkipBtn').addEventListener('click', finish);
        card.querySelector('#tourNextBtn').addEventListener('click', () => {
            step += 1;
            if (step >= steps.length) return finish();
            showStep();
        });
    };

    const finish = () => {
        localStorage.setItem(PORTFOLIO_TOUR_KEY, '1');
        document.querySelectorAll('.tour-highlight').forEach(n => n.classList.remove('tour-highlight'));
        overlay.remove();
    };

    showStep();
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
    setTimeout(startPortfolioTour, 600);
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
    const items = getSortedPortfolioItems();
    container.innerHTML = '';

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'content-card';
        const dataCat = normalizePortfolioCategory(item.category, item.type);
        card.setAttribute('data-category', dataCat);
        card.setAttribute('data-title', (item.title || '').toLowerCase());
        // create thumbnail and info
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail';

        if (item.type === 'video') {
            if (isYouTubeUrl(item.src)) {
                thumb.innerHTML = `<iframe src="${item.src}" frameborder="0" allowfullscreen></iframe>`;
            } else {
                thumb.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#e0e0e0;font-size:36px;"><i class="fas fa-play-circle"></i></div>';
            }
            card.addEventListener('click', () => openPortfolioItemByIndex(index));
        } else if (item.type === 'image') {
            const img = document.createElement('img'); img.src = item.src; img.alt = item.title || '';
            thumb.appendChild(img);
            card.addEventListener('click', () => openPortfolioItemByIndex(index));
        } else if (item.type === 'document') {
            const img = document.createElement('img'); img.src = 'https://i.pinimg.com/originals/1a/1a/1a/1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a.jpg'; img.alt = 'doc';
            thumb.appendChild(img);
            card.addEventListener('click', () => openPortfolioItemByIndex(index));
        } else if (item.type === 'audio') {
            // show a simple audio icon in thumbnail
            thumb.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#e0e0e0;font-size:36px;"><i class="fas fa-music"></i></div>';
            card.addEventListener('click', () => openPortfolioItemByIndex(index));
        } else {
            const img = document.createElement('img'); img.src = 'https://i.pinimg.com/originals/3c/3c/3c/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c.jpg'; img.alt = 'file';
            thumb.appendChild(img);
            card.addEventListener('click', () => openPortfolioItemByIndex(index));
        }

        const info = document.createElement('div'); info.className = 'card-info';
        const displayCat = dataCat === 'videography'
            ? 'Videography'
            : dataCat === 'photography'
                ? 'Photography'
                : dataCat === 'audio'
                    ? 'Audio Engineering'
                    : dataCat === 'music'
                        ? 'Music'
                    : dataCat === 'document'
                        ? 'Document'
                        : 'Other';
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

        // action menu (delete, edit, copy)
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

        card.appendChild(thumb);
        card.appendChild(info);
        card.appendChild(dl);
        card.appendChild(actions);
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
    const fileInput = document.getElementById('portfolioFileInput');
    const urlInput = document.getElementById('portfolioUrlInput');
    const titleInput = document.getElementById('portfolioTitleInput');
    const category = document.getElementById('portfolioCategory').value;

    let src = '';
    let type = category || 'other';
    const items = getPortfolioItems();

    // Priority: file input > url
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        // create object URL for local preview/download
        src = URL.createObjectURL(file);
        const fileSize = file.size || 0;
        // derive type by mime
        if (file.type.startsWith('image/')) type = 'image';
        else if (
            file.type === 'application/pdf' ||
            file.name.match(/\.(doc|docx|odt|rtf|xls|xlsx|csv|ods|ppt|pptx|odp|txt|md|json|xml|yaml|yml|log)$/i)
        ) type = 'document';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';
        else if (file.name.match(/\.(rar|zip|7z)$/i)) type = file.name.match(/\.(rar)$/i) ? 'rar' : 'zip';
        else if (file.name.match(/\.(exe|msi|deb|rpm)$/i)) type = 'software';
        else type = 'other';
    } else if (urlInput.value.trim()) {
        src = normalizeCloudLink(urlInput.value.trim());
        // guess type by extension
        if (src.match(/\.(pdf|doc|docx|odt|rtf|xls|xlsx|csv|ods|ppt|pptx|odp|txt|md|json|xml|yaml|yml|log)($|\?)/i)) type = 'document';
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
    const normalizedCategory = normalizePortfolioCategory(category, type);
    // mapping rules: videography -> video, photography -> image, audio -> audio
    const categoryToType = { 'videography': 'video', 'photography': 'image', 'audio': 'audio', 'music': 'audio', 'document': 'document', 'other': null };
    const expectedType = categoryToType[normalizedCategory] || null;
    if (expectedType && expectedType !== type) {
        alert(`Category "${category}" expects ${expectedType} files. Please select a matching file or change the category.`);
        return;
    }

    // limit to 5 items: remove oldest if necessary
    while (items.length >= 12) items.shift();

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
        const cat = normalizePortfolioCategory(card.getAttribute('data-category'));
        const activeBtn = document.querySelector('.category-btn.active');
        const selectedCat = activeBtn ? normalizePortfolioCategory(activeBtn.textContent) : 'all';
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

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('docModal');
    if (!modal || modal.style.display !== 'flex') return;

    if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateDocItem(1);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateDocItem(-1);
    } else if (e.key === 'Escape') {
        e.preventDefault();
        closeDocModal();
    } else if (e.key === ' ') {
        const media = modal.querySelector('video, audio');
        if (media) {
            e.preventDefault();
            if (media.paused) media.play();
            else media.pause();
        }
    }
});