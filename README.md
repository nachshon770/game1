
<!DOCTYPE html>
<html lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ערוץ החברים</title>
  <meta name="description" content="ערוץ החברים - ערוץ בידור איכותי בעברית. צפו בסדרות מקוריות כמו 'תחבולות בזמן' ועוד תכנים מרתקים.">
  <meta name="keywords" content="ערוץ החברים, תחבולות בזמן, בידור, סדרות, תכנים, ערוץ, החברים">
  <meta name="author" content="ערוץ החברים">
  <meta name="publisher" content="ערוץ החברים">
  <meta name="application-name" content="ערוץ החברים">
  <meta name="apple-mobile-web-app-title" content="ערוץ החברים">
  <meta property="twitter:image" content="https://yoursite.com/ערוץ מבניד.png">
  <meta property="twitter:image:alt" content="לוגו ערוץ החברים">
  <meta name="google-site-verification" content="V-EOk6W3o323390u1g7ZaupTtiis6uGcje40UP-rVOg" />  <!-- מודל דינמי לנגן וידאו -->
  <div id="dynamicVideoModal" class="video-modal">
    <div class="video-content">
      <button onclick="closeVideoModal()" class="modal-close">×</button>
      
      <!-- כותרת הסרט -->
      <div class="video-header">
        <h2 id="videoTitle" class="video-title">טוען...</h2>
        <div class="video-meta">
          <span id="videoEpisode" class="video-episode">פרק חדש</span>
        </div>
      </div>
      
      <!-- נגן הווידאו המשודרג בסגנון מעמול -->
      <div class="video-wrapper">
        <!-- מסך טעינה מקצועי -->
        <div class="video-loading-screen hidden" id="videoLoadingScreen">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">טוען תוכן...</div>
            <div class="loading-subtext">נא להמתין רגע קט</div>
          </div>
        </div>
        
        <video id="dynamicVideo" controls class="jw-video jw-reset video-player" 
               tabindex="-1" 
               disableremoteplaybook="" 
               webkit-playsinline="" 
               playsinline="" 
               oncontextmenu="return false;" 
               controlsList="nodownload"
               poster="">
          <source src="" type="video/mp4">
          הדפדפן שלך אינו תומך בניגון וידאו.
        </video>
        
        <!-- אייקון play מרכזי כמו מעמול -->
        <div class="video-play-overlay" onclick="togglePlayPause()">
          <div class="play-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- המשך אוטומטי -->
      <div class="auto-continue">
        <div class="continue-text">
          <span class="continue-icon">❯❯</span>
          המשך אוטומטית לפרק הבא
        </div>
      </div>
    </div>
  </div>

  <!-- JavaScript לפונקציונליות הנגן המשודרג בסגנון מעמול -->
  <script>
    function togglePlayPause() {
      const video = document.getElementById('dynamicVideo');
      const overlay = document.querySelector('.video-play-overlay');
      const wrapper = document.querySelector('.video-wrapper');
      
      if (video && overlay) {
        if (video.paused) {
          video.play();
          wrapper.classList.remove('paused');
        } else {
          video.pause();
          wrapper.classList.add('paused');
        }
      }
    }
    
    function toggleFullscreen() {
      const video = document.getElementById('dynamicVideo');
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
    
    function shareVideo() {
      if (navigator.share) {
        navigator.share({
          title: document.getElementById('videoTitle').textContent,
          text: 'צפו בפרק החדש מערוץ החברים',
          url: window.location.href
        });
      } else {
        // העתקה ללוח
        navigator.clipboard.writeText(window.location.href);
        alert('הקישור הועתק ללוח!');
      }
    }
    
    function likeVideo() {
      // אנימציה של לייק
      const btn = event.target.closest('.action-btn');
      btn.style.transform = 'scale(1.2)';
      btn.style.background = 'rgba(255, 107, 53, 0.4)';
      
      setTimeout(() => {
        btn.style.transform = '';
        btn.style.background = '';
      }, 300);
      
      alert('תודה על הלייק! ❤️');
    }
    
    // מאזיני אירועים לנגן בסגנון מעמול
    document.addEventListener('DOMContentLoaded', function() {
      const video = document.getElementById('dynamicVideo');
      const loadingScreen = document.getElementById('videoLoadingScreen');
      const wrapper = document.querySelector('.video-wrapper');
      
      if (video && loadingScreen && wrapper) {
        // כשהסרטון מתחיל לטעון
        video.addEventListener('loadstart', () => {
          document.getElementById('videoTitle').textContent = 'טוען פרק...';
          loadingScreen.classList.remove('hidden');
        });
        
        // כשהסרטון מוכן לנגינה
        video.addEventListener('canplay', () => {
          setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.getElementById('videoTitle').textContent = 'פרק חדש';
          }, 1000); // עיכוב קטן לאפקט
        });
        
        // כשהסרטון מתחיל
        video.addEventListener('play', () => {
          wrapper.classList.remove('paused');
        });
        
        // כשהסרטון נעצר
        video.addEventListener('pause', () => {
          wrapper.classList.add('paused');
        });
        
        // בהתחלה הסרטון בפוזה
        wrapper.classList.add('paused');
      }
    });
    
    // פונקציה גלובלית לסגירת הווידאו
    function closeVideoModal() {
      const modal = document.getElementById('dynamicVideoModal');
      if (modal) {
        const video = document.getElementById('dynamicVideo');
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        
        // הסתר את המודל עם אפקט
        modal.classList.remove('show');
        const videoContent = modal.querySelector('.video-content');
        if (videoContent) {
          videoContent.classList.remove('show');
        }
        
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    }
    
    // הפוך את הפונקציה זמינה גלובלית
    window.closeVideoModal = closeVideoModal;
  </script>

  <!-- פונקציות למודל הפרקים והנגן בסגנון ערוץ מאיר -->
  <script>
    // פתיחת מודל הפרקים
    function openEpisodesModal(seriesId, seriesTitle) {
      const modal = document.getElementById('episodesModal');
      modal.innerHTML = `
        <div class="episodes-content-meir">
          <button onclick="closeEpisodesModal()" class="modal-close-meir">×</button>
          <div class="series-header-meir">
            <h2 class="series-title-meir">${seriesTitle}</h2>
            <p class="series-subtitle-meir">בחר פרק לצפייה</p>
          </div>
          <div class="episodes-grid-meir" id="episodesGrid">
            <div class="loading-episodes">
              <div class="spinner-episodes"></div>
              <p>טוען פרקים...</p>
            </div>
          </div>
        </div>
      `;
      modal.style.display = 'flex';
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
      loadEpisodes(seriesId, seriesTitle);
    }
    
    // טעינת הפרקים
    function loadEpisodes(seriesId, seriesTitle) {
      if (!firebase || !firebase.database) {
        console.error('Firebase not ready');
        document.getElementById('episodesGrid').innerHTML = '<div class="error-message">שגיאה: Firebase לא מוכן</div>';
        return;
      }
      
      firebase.database().ref('episodes')
        .orderByChild('seriesId')
        .equalTo(seriesId)
        .once('value')
        .then((snapshot) => {
          const episodes = [];
          snapshot.forEach((childSnapshot) => {
            episodes.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          
          episodes.sort((a, b) => a.order - b.order);
          renderEpisodes(episodes, seriesTitle, seriesId);
        })
        .catch((error) => {
          console.error('Error loading episodes:', error);
          document.getElementById('episodesGrid').innerHTML = '<div class="error-message">שגיאה בטעינת הפרקים</div>';
        });
    }
    
    // רינדור הפרקים
    function renderEpisodes(episodes, seriesTitle, seriesId) {
      const grid = document.getElementById('episodesGrid');
      
      if (episodes.length === 0) {
        grid.innerHTML = '<div class="no-episodes">אין פרקים זמינים לסדרה זו</div>';
        return;
      }
      
      // עדכון מספר הפרקים בכותרת
      const subtitle = document.querySelector('.series-subtitle-meir');
      if (subtitle) {
        subtitle.textContent = `בחר פרק לצפייה • ${episodes.length} פרקים זמינים`;
      }
      
      grid.innerHTML = episodes.map((episode, index) => `
        <div class="episode-card-meir" onclick="openEpisodeInNewPage('${seriesId}', ${index})">
          <div class="episode-number">${index + 1}</div>
          <div class="episode-info">
            <h3 class="episode-title">
              ${episode.title ? `פרק ${index + 1}: ${episode.title}` : `פרק ${index + 1}`}
            </h3>
            <p class="episode-description">${episode.description || 'לחץ לצפייה בפרק המרתק הזה'}</p>
            <div class="episode-meta">
              <span class="episode-duration">⏱️ ${episode.duration || 'זמן לא ידוע'}</span>
              ${episode.releaseDate ? `<span class="episode-date">📅 ${episode.releaseDate}</span>` : ''}
            </div>
          </div>
          <div class="play-button-small">▶</div>
        </div>
      `).join('');
    }
    
    // פתיחת פרק בעמוד נפרד - הפונקציה החדשה המשופרת
    function openEpisodeInNewPage(seriesId, episodeIndex) {
      const episodeUrl = `episode.html?series=${seriesId}&episode=${episodeIndex}`;
      window.open(episodeUrl, '_blank');
    }
    
    // פתיחת הנגן בסגנון ערוץ מאיר (גיבוי למודל)
    function playEpisode(videoUrl, seriesTitle, episodeNumber, episodeTitle) {
      closeEpisodesModal();
      
      // עדכון הכותרת
      document.getElementById('videoTitle').textContent = `${seriesTitle} › ${episodeNumber}`;
      if (episodeTitle) {
        document.getElementById('videoEpisode').textContent = episodeTitle;
      } else {
        document.getElementById('videoEpisode').textContent = episodeNumber;
      }
      
      // טעינת הווידאו
      const video = document.getElementById('dynamicVideo');
      const source = video.querySelector('source');
      const loadingScreen = document.getElementById('videoLoadingScreen');
      
      // הצגת מסך טעינה
      loadingScreen.classList.remove('hidden');
      
      // עדכון מקור הווידאו
      source.src = videoUrl;
      video.load();
      
      // פתיחת המודל
      const modal = document.getElementById('dynamicVideoModal');
      modal.style.display = 'flex';
      modal.classList.add('show');
      
      // אנימציה לתוכן
      setTimeout(() => {
        document.querySelector('.video-content').classList.add('show');
      }, 100);
    }
    
    // סגירת מודל הפרקים עם אנימציה
    function closeEpisodesModal() {
      const modal = document.getElementById('episodesModal');
      if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    }
    
    // סגירת מודל הווידאו
    function closeVideoModal() {
      const modal = document.getElementById('dynamicVideoModal');
      const video = document.getElementById('dynamicVideo');
      
      video.pause();
      video.currentTime = 0;
      
      modal.classList.remove('show');
      document.querySelector('.video-content').classList.remove('show');
      
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  </script>

  <!-- תחרות הצגות -->
  
  <!-- PWA Meta Tags -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-TileColor" content="#4dd0e1">
  <meta name="msapplication-config" content="browserconfig.xml">
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="my-files/ערוץ החברים.png">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yoursite.com/">
  <meta property="og:title" content="ערוץ החברים">
  <meta property="og:site_name" content="ערוץ החברים">
  <meta property="og:description" content="ערוץ החברים - ערוץ בידור איכותי בעברית. צפו בסדרות מקוריות כמו 'תחבולות בזמן' ועוד תכנים מרתקים.">
  <meta property="og:image" content="https://yoursite.com/my-files/ערוץ החברים.png">
  <meta property="og:image:alt" content="לוגו ערוץ החברים">
  <meta property="og:locale" content="he_IL">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://yoursite.com/">
  <meta property="twitter:title" content="ערוץ החברים">
  <meta property="twitter:site" content="@ערוץהחברים">
  <meta property="twitter:creator" content="@ערוץהחברים">
  <meta property="twitter:description" content="ערוץ החברים - ערוץ בידור איכותי בעברית. צפו בסדרות מקוריות כמו 'תחבולות בזמן' ועוד תכנים מרתקים.">
  <meta property="twitter:image" content="https://yoursite.com/my-files/ערוץ החברים.png">
  <meta property="twitter:image:alt" content="לוגו ערוץ החברים">
  
  <link rel="icon" type="image/png" href="my-files/ערוץ החברים.png">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="mobile-fix.css">
  
  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-database-compat.js"></script>
  
  <!-- CSS נוסף לשיפור נייד והסתרת סרגל גלילה -->
  <style>
    /* הסתרת סרגל הגלילה בכל הדפדפנים */
    html, body {
      overflow-x: hidden; /* מונע גלילה אופקית */
      overflow-y: auto; /* מאפשר גלילה אנכית */
      max-width: 100vw;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
    }
    
    /* הסתרת scrollbar ב-Webkit (Chrome, Safari, Edge) */
    html::-webkit-scrollbar,
    body::-webkit-scrollbar,
    *::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      display: none;
      background: transparent;
    }
    
    /* ודאות שהגלילה עדיין עובדת */
    html {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    body {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    * {
      box-sizing: border-box;
      max-width: 100vw; /* מונע אלמנטים לחרוג מרוחב המסך */
    }
    
    /* אנימציה לרקע */
    @keyframes backgroundMove {
      0% { 
        background-position: 0% 50%; 
      }
      50% { 
        background-position: 100% 50%; 
      }
      100% { 
        background-position: 0% 50%; 
      }
    }
    
    .animated-background {
      background: linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 20%, #4dd0e1 40%, #26c6da 60%, #00bcd4 80%, #0097a7 100%);
      background-size: 200% 100%;
      animation: backgroundMove 8s ease-in-out infinite;
    }
    
    .main-title {
      color: #2d004d;
      text-align: center;
      margin: 75px 0 20px 0;
      text-shadow: 2px 2px 6px rgba(0,0,0,0.3);
      font-size: 3.5rem;
      position: relative;
      z-index: 100;
    }
    
    /* שיפור התצוגה הניידת - מניעת חפיפה */
    @media (max-width: 900px) {
      body {
        padding-top: 10px;
      }
      
      .main-title {
        font-size: 2.5rem !important;
        margin: 25px 0 15px 0 !important;
      }
    }
    
    @media (max-width: 800px) {
      .main-title {
        font-size: 1.8rem !important;
        margin: 15px 0 10px 0 !important;
        padding: 0 10px !important;
        z-index: 1000;
        position: relative;
      }
      
      .series-grid {
        margin-top: 15px !important;
        padding: 0 10px !important;
      }
      
      .mobile-nav {
        display: block !important;
      }
      
      .top-menu {
        display: none !important;
      }
      
      /* שיפור חוויית המגע */
      .btn, button, a {
        min-height: 44px !important;
        min-width: 44px !important;
        touch-action: manipulation;
      }
      
      /* שיפור המודלים בנייד */
      .modal-content {
        margin: 10px !important;
        max-height: 90vh !important;
        overflow-y: auto !important;
      }
      
      .video-content {
        max-width: 95vw !important;
        max-height: 85vh !important;
      }
      
      .video-player {
        width: 100% !important;
        height: auto !important;
      }
      
      .modal-close {
        top: 10px !important;
        right: 10px !important;
        width: 35px !important;
        height: 35px !important;
        font-size: 18px !important;
      }
    }
    
    @media (max-width: 600px) {
      .main-title {
        font-size: 1.6rem !important;
        margin: 40px 0 8px 0 !important;
        padding: 0 5px !important;
      }
      
      .series-grid {
        margin-top: 10px !important;
      }
    }
    
    @media (max-width: 400px) {
      .main-title {
        font-size: 1.4rem !important;
        margin: 30px 0 5px 0 !important;
        padding: 0 5px !important;
      }
      
      .series-grid {
        margin-top: 15px !important;
      }
    }
    
    /* אפקטי hover לכפתורי התחברות והרשמה */
    #floatingSignupBtn:hover,
    #loginBtn:hover {
      background: linear-gradient(45deg, #e0f7fa, #b2ebf2) !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(224,247,250,0.5) !important;
    }
  </style>
  
  <!-- Firebase SDK (טעינה ישירה מה-CDN בלבד, אין קבצים מקומיים!) -->
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js" onload="console.log('Firebase app loaded')" onerror="console.error('Failed to load firebase-app.js')"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js" onload="console.log('Firebase database loaded')" onerror="console.error('Failed to load firebase-database.js')"></script>
  
  <!-- שיפורי נגן הווידאו -->
  <script src="video-enhancements.js"></script>
  
  <!-- Schema.org JSON-LD for better SEO -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ערוץ החברים",
    "alternateName": ["Channel Friends", "ערוץ החברים", "החברים"],
    "url": "https://yoursite.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoursite.com/ערוץ מבניד.png",
      "width": "300",
      "height": "300"
    },
    "image": "https://yoursite.com/ערוץ מבניד.png",
    "description": "ערוץ החברים - ערוץ בידור איכותי בעברית. צפו בסדרות מקוריות כמו 'תחבולות בזמן' ועוד תכנים מרתקים.",
    "slogan": "בידור איכותי בעברית",
    "foundingDate": "2025",
    "sameAs": [
      "https://yoursite.com"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Hebrew"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IL"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://yoursite.com"
    }
  }
  </script>
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ערוץ החברים",
    "url": "https://yoursite.com",
    "description": "ערוץ החברים - ערוץ בידור איכותי בעברית",
    "inLanguage": "he",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://yoursite.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ערוץ החברים",
        "item": "https://yoursite.com"
      }
    ]
  }
  </script>
</head>
<body itemscope itemtype="https://schema.org/Organization" class="animated-background" style="margin: 0; min-height: 100vh; font-family: Arial, sans-serif; direction: rtl; position: relative;">
  <!-- רקע דקורטיבי -->
  <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 20% 80%, rgba(224,247,250,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(178,235,242,0.2) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(77,208,225,0.1) 0%, transparent 50%); z-index: 1; pointer-events: none;"></div>
  
  <h1 itemprop="name" class="main-title" style="position: relative; z-index: 100; background: linear-gradient(45deg, #2d004d, #4a148c, #6a1b9a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));">ערוץ החברים</h1>
  
  <!-- תפריט נייד -->
  <div class="mobile-nav">
    <button class="hamburger-btn" onclick="toggleMobileMenu()">☰</button>
    <div class="mobile-menu" id="mobileMenu">
      <!-- כפתורים למשתמש לא מחובר -->
      <div id="mobileMenuGuest">
        <button onclick="openSignupModal(); closeMobileMenu();">הרשמה בחינם</button>
        <button onclick="openLoginModal(); closeMobileMenu();">התחברות</button>
      </div>
      <!-- כפתור למשתמש מחובר -->
      <div id="mobileMenuLoggedIn" style="display:none;">
        <button onclick="handleLogout(); closeMobileMenu();" style="background:#f44336; color:white;">התנתקות</button>
      </div>
      <!-- כפתורים כלליים -->
      <a href="https://xn----2hcgfw2apl2a2a.boti.bot/fadichot.html" target="_blank">� דף בדיחות</a>
      <button onclick="openAboutModal(); closeMobileMenu();">ℹ️ אודות</button>
      <a href="games.html">🎮 משחקים</a>
      <button onclick="openContactModal(); closeMobileMenu();">📧 יצירת קשר</button>
    </div>
  </div>
  
  <!-- תפריט עליון -->
  <div class="top-menu">
    <!-- כפתורים בצד ימין (RTL - left) -->
    <div class="menu-section">
      <button id="floatingSignupBtn" class="btn" onclick="openSignupModal()" style="background: linear-gradient(45deg, #0097a7, #00838f); box-shadow: 0 4px 15px rgba(0,151,167,0.4); border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s ease;">הרשמה בחינם</button>
      <button id="loginBtn" onclick="openLoginModal()" class="btn" style="background: linear-gradient(45deg, #0097a7, #00838f); box-shadow: 0 4px 15px rgba(0,151,167,0.4); border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s ease;">התחברות</button>
      <span id="userInfoText"></span>
      <button id="logoutBtn" onclick="handleLogout()" class="btn btn-logout" style="display:none; background: linear-gradient(45deg, #f44336, #d32f2f); box-shadow: 0 4px 15px rgba(244,67,54,0.3); border: 1px solid rgba(255,255,255,0.2);">התנתקות</button>
    </div>
    
    <!-- כפתורים בצד שמאל (RTL - right) -->
    <div id="userInfoBar" class="menu-section">
      <a href="https://xn----2hcgfw2apl2a2a.boti.bot/fadichot.html" target="_blank" id="jokesBtn" class="btn" style="background: linear-gradient(45deg, #ff9800, #f57c00); text-decoration:none; display:inline-block; box-shadow: 0 4px 15px rgba(255,152,0,0.3); border: 1px solid rgba(255,255,255,0.2);">� דף בדיחות</a>
      <button onclick="openAboutModal()" id="aboutBtn" class="btn" style="background: linear-gradient(45deg, #795548, #5d4037); box-shadow: 0 4px 15px rgba(121,85,72,0.3); border: 1px solid rgba(255,255,255,0.2);">ℹ️ אודות</button>
      <a href="games.html" id="gamesBtn" class="btn" style="background: linear-gradient(45deg, #e91e63, #c2185b); text-decoration:none; display:inline-block; box-shadow: 0 4px 15px rgba(233,30,99,0.3); border: 1px solid rgba(255,255,255,0.2);">🎮 משחקים</a>
      <a href="contact.html" id="contactBtn" class="btn" style="background: linear-gradient(45deg, #4caf50, #388e3c); text-decoration:none; display:inline-block; box-shadow: 0 4px 15px rgba(76,175,80,0.3); border: 1px solid rgba(255,255,255,0.2);">📧 יצירת קשר</a>
    </div>
  </div>
  <!-- טופס הרשמה קופץ -->
  <div id="signupModal" class="modal">
    <div class="modal-content">
      <button onclick="closeSignupModal()" class="modal-close">×</button>
      <h2>הרשמה</h2>
      <input id="signupRealName" type="text" placeholder="השם שלך" class="input-field" />
      <input id="signupUsername" type="text" placeholder="שם משתמש רצוי" class="input-field" />
      <input id="signupPassword" type="password" placeholder="סיסמה רצויה" class="input-field" />
      <input id="signupPhone" type="tel" placeholder="מספר טלפון" class="input-field" />
      <button onclick="handleSignup()" class="btn">הרשמה</button>
      <div id="signupMsg" class="message"></div>
    </div>
  </div>
  
  <!-- טופס התחברות קופץ -->
  <div id="loginModal" class="modal">
    <div class="modal-content">
      <button onclick="closeLoginModal()" class="modal-close">×</button>
      <h2>התחברות</h2>
      <input id="loginUsername" type="text" placeholder="שם משתמש" class="input-field" />
      <input id="loginPassword" type="password" placeholder="סיסמה" class="input-field" />
      <button onclick="handleLogin()" class="btn">התחברות</button>
      <div id="loginMsg" class="message"></div>
    </div>
  </div>

  <!-- תוכן ראשי -->
  <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:50vh; width:100vw; position:relative; z-index:2;">
    <div class="series-grid" style="margin-top:-30px; margin-bottom:0;">
      <!-- הכרטיסים יתווספו דינמית מFirebase -->
      <div class="loading-indicator" style="display:none;">
        <div class="spinner"></div>
        <p>טוען סדרות...</p>
      </div>
    </div>
  </div>
  
  <!-- חלונית קופצת עם רקע חצי שקוף לרשימת הפרקים -->
  <div id="episodesModal" class="episodes-modal"></div>
  
  <!-- תבנית תוכן רשימת הפרקים לשחזור דינמי -->
  <template data-episodes-modal-template>
    <div class="episodes-content">
      <button onclick="closeEpisodesModal()" class="modal-close">×</button>
      <div class="series-info">
        <!-- תוכן דינמי יוכנס כאן -->
      </div>
    </div>
  </template>
  
  <!-- מודל דינמי לנגן וידאו -->
  <div id="dynamicVideoModal" class="video-modal">
    <div class="video-content">
      <button onclick="closeVideoModal()" class="modal-close">×</button>
      <video id="dynamicVideo" controls class="jw-video jw-reset video-player" tabindex="-1" disableremoteplayback="" webkit-playsinline="" playsinline="" oncontextmenu="return false;" controlsList="nodownload">
        <source src="" type="video/mp4">
        הדפדפן שלך אינו תומך בניגון וידאו.
      </video>
    </div>
  </div>


  

  
  <!-- תחרות הצגות -->
  <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-top:25px; margin-bottom:80px;">
    <div style="text-align:center; color:#2d004d; font-size:1.5rem; margin-top:-8px; text-shadow:1px 1px 6px #0005; max-width:700px;">
      <a href="https://docs.google.com/forms/d/1kE8gy5OqkL1Id_eaLakSC0Lg7WG4P5iUzhND3B0VEkE/preview" style="color:#e91e63; text-decoration:underline; font-weight:bold;">🎪 תחרות הצגות! מי שישלח את ההצגה הכי טובה יקבל 2 פרקים חדשים שעדיין לא עלו לאתר!</a>
    </div>
  </div>
  
  <!-- מודאל יצירת קשר -->
  <div id="contactModal" class="modal">
    <div class="modal-content contact-modal contact-content">
      <button onclick="closeContactModal()" class="modal-close">×</button>
      <h2>📧 יצירת קשר</h2>
      
      <div class="contact-text">
        <p style="margin-bottom:16px;">רוצים ליצור איתנו קשר? שמחים לשמוע מכם!</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <button onclick="copyEmail('n@noti.bot')" class="email-button">
            📧 שלחו לנו מייל: n@noti.bot
          </button>
          <button onclick="copyEmail('s@boti.bot')" class="email-button" style="margin-top: 10px;">
            📧 מייל נוסף: s@boti.bot
          </button>
          <p id="emailCopied" class="message message-success" style="margin-top: 10px; display: none; font-weight: bold;">כתובת המייל הועתקה ללוח!</p>
        </div>
        
        <div class="contact-info">
          <p>💡 מה אתם יכולים לשלוח לנו:</p>
          <ul>
            <li>שאלות כלליות על הערוץ</li>
            <li>הצעות לשיפור</li>
            <li>בעיות טכניות באתר</li>
            <li>בקשות לתוכן חדש</li>
            <li>שיתופי פעולה</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- מודאל אודות -->
  <div id="aboutModal" class="modal">
    <div class="modal-content contact-modal contact-content">
      <button onclick="closeAboutModal()" class="modal-close">×</button>
      <h2>ℹ️ אודות ערוץ החברים</h2>
      
      <div class="contact-text">
        <p style="margin-bottom:16px;">ברוכים הבאים לערוץ החברים - ערוץ הבידור הישראלי שלכם!</p>
        
        <div class="contact-info">
          <p>🎬 <strong>מה אנחנו:</strong></p>
          <ul>
            <li>ערוץ בידור איכותי בעברית</li>
            <li>סדרות מקוריות ומרתקות</li>
            <li>תוכן חדש ומעניין</li>
            <li>משחקים אינטראקטיביים</li>
          </ul>
          
          <p>🌟 <strong>הסדרות שלנו:</strong></p>
          <ul>
            <li>תחבולות בזמן - הסדרה הפופולרית שלנו</li>
            <li>ועוד סדרות מרתקות בדרך!</li>
          </ul>
          
          <p>🎯 <strong>המטרה שלנו:</strong></p>
          <ul>
            <li>להעניק בידור איכותי לכל המשפחה</li>
            <li>ליצור תוכן ישראלי מקורי</li>
            <li>לבנות קהילה של צופים נאמנים</li>
          </ul>
          
          <p>📅 <strong>הקמת הערוץ:</strong> 2025</p>
          <p>🏆 <strong>חזון:</strong> להיות הערוץ המוביל לבידור ישראלי ברשת</p>
        </div>
        
        <!-- זכויות יוצרים -->
        <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
          <span onclick="window.open('https://sites.google.com/1ce.org/nju/%D7%9E%D7%AA%D7%99%D7%97%D7%95%D7%AA?authuser=0', '_blank')" 
                style="color: #666; font-size: 12px; cursor: pointer; opacity: 0.8; transition: all 0.3s ease;"
                onmouseover="this.style.opacity='1'; this.style.color='#4a148c'"
                onmouseout="this.style.opacity='0.8'; this.style.color='#666'">
            כל הזכויות שמורות למתע
          </span>
        </div>
      </div>
    </div>
  </div>

  <script src="admin-manager.js"></script>
  <script src="script.js?1"></script>
  
  <script>
    // פונקציות לתפריט נייד
    function toggleMobileMenu() {
      const mobileMenu = document.getElementById('mobileMenu');
      mobileMenu.classList.toggle('active');
    }
    
    function closeMobileMenu() {
      const mobileMenu = document.getElementById('mobileMenu');
      mobileMenu.classList.remove('active');
    }
    
    // סגירת התפריט כשלוחצים מחוץ לו
    document.addEventListener('click', function(event) {
      const mobileNav = document.querySelector('.mobile-nav');
      const mobileMenu = document.getElementById('mobileMenu');
      
      if (!mobileNav.contains(event.target)) {
        mobileMenu.classList.remove('active');
      }
    });
    
    // פונקציות לפתיחת וסגירת מודאל אודות
    function openAboutModal() {
      document.getElementById('aboutModal').style.display = 'block';
    }
    
    function closeAboutModal() {
      document.getElementById('aboutModal').style.display = 'none';
    }
    
    // פונקציה לפתיחת עמוד יצירת קשר
    function openContactModal() {
      window.location.href = 'contact.html';
    }
    
    // טיפול ב-hash בכתובת לפתיחת מודלים
    window.addEventListener('DOMContentLoaded', function() {
      const hash = window.location.hash;
      if (hash === '#login') {
        setTimeout(() => {
          openLoginModal();
          window.location.hash = ''; // נקה את ה-hash
        }, 500);
      } else if (hash === '#signup') {
        setTimeout(() => {
          openSignupModal();
          window.location.hash = ''; // נקה את ה-hash
        }, 500);
      }
      
      // בדיקת מנהל מחובר
      setTimeout(() => {
        checkAdminStatus();
      }, 100);
      
      // הפעל רינדור הסדרות
      setTimeout(() => {
        if (typeof SeriesRenderer !== 'undefined') {
          SeriesRenderer.renderMainContent();
        }
      }, 100);
    });
  </script>
  <script src="script-series.js"></script>

</body>
</html>
