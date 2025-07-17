// משחק פקמן
class PacmanGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        
        this.cellSize = 25;
        this.rows = this.canvas.height / this.cellSize;
        this.cols = this.canvas.width / this.cellSize;
        
        this.score = 0;
        this.lives = 3;
        this.gameRunning = true;
        this.paused = false;
        
        // עדכון התצוגה מיד
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        
        this.pacman = {
            x: 1,
            y: 1,
            direction: 'right',
            mouthOpen: true
        };
        
        this.ghosts = [
            { x: 18, y: 10, direction: 'up', color: '#ff0000' },
            { x: 22, y: 10, direction: 'down', color: '#ffb8ff' },
            { x: 18, y: 14, direction: 'left', color: '#00ffff' },
            { x: 22, y: 14, direction: 'right', color: '#ffb852' }
        ];
        
        
        // וידוא שתמיד יהיו 4 מפלצות
        this.ensureFourGhosts();
        
        this.createMaze();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    // פונקציה לוידוא שתמיד יהיו 4 מפלצות
    ensureFourGhosts() {
        const ghostColors = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb852'];
        const directions = ['up', 'down', 'left', 'right'];
        
        while (this.ghosts.length < 4) {
            const colorIndex = this.ghosts.length % ghostColors.length;
            const directionIndex = this.ghosts.length % directions.length;
            
            this.ghosts.push({
                x: 20 + (this.ghosts.length - 4) * 2,
                y: 10 + this.ghosts.length * 2,
                direction: directions[directionIndex],
                color: ghostColors[colorIndex]
            });
        }
        
        // אם יש יותר מ-4, השאר רק 4
        if (this.ghosts.length > 4) {
            this.ghosts = this.ghosts.slice(0, 4);
        }
    }
    
    createMaze() {
        // יצירת מבוך פשוט עם הרבה פחות נקודות
        this.maze = [];
        for (let row = 0; row < this.rows; row++) {
            this.maze[row] = [];
            for (let col = 0; col < this.cols; col++) {
                if (
                    row === 0 || row === this.rows - 1 ||
                    col === 0 || col === this.cols - 1 ||
                    (row % 2 === 0 && col % 2 === 0) || // הרבה יותר קירות
                    (row % 3 === 1 && col % 4 === 2) || // עוד קירות
                    (col % 3 === 1 && row % 4 === 2) || // עוד קירות
                    (row % 4 === 0 && col % 3 === 0) || // עוד יותר קירות
                    (col % 4 === 0 && row % 3 === 0)    // עוד יותר קירות
                ) {
                    this.maze[row][col] = 1; // קיר
                } else {
                    this.maze[row][col] = 0; // מסדרון עם נקודה
                }
            }
        }

        // ניקוי אזור ההתחלה של פקמן - יותר רחב
        for (let dy = 0; dy < 3; dy++) {
            for (let dx = 0; dx < 3; dx++) {
                if (1 + dx < this.cols && 1 + dy < this.rows) {
                    this.maze[1 + dy][1 + dx] = 0;
                }
            }
        }

        // ניקוי אזור הרוחות - יותר רחב
        for (let i = 0; i < this.ghosts.length; i++) {
            const ghost = this.ghosts[i];
            if (ghost.x >= 0 && ghost.x < this.cols && ghost.y >= 0 && ghost.y < this.rows) {
                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                        const nx = ghost.x + dx;
                        const ny = ghost.y + dy;
                        if (nx > 0 && nx < this.cols - 1 && ny > 0 && ny < this.rows - 1) {
                            this.maze[ny][nx] = 0;
                        }
                    }
                }
            }
        }

        // יצירת מסדרונות מחברים כדי שהמשחק יהיה עדיין ניתן לשחק
        for (let row = 1; row < this.rows - 1; row += 4) {
            for (let col = 1; col < this.cols - 1; col++) {
                this.maze[row][col] = 0;
            }
        }
        
        for (let col = 1; col < this.cols - 1; col += 4) {
            for (let row = 1; row < this.rows - 1; row++) {
                this.maze[row][col] = 0;
            }
        }
        
        // הוספת נקודות גדולות בפינות
        this.addPowerPellets();
    }
    
    addPowerPellets() {
        // מיקום הנקודות הגדולות בפינות (קשות להגיע)
        const powerPelletPositions = [
            { x: 2, y: 2 },     // פינה שמאל עליון
            { x: this.cols - 3, y: 2 },     // פינה ימין עליון
            { x: 2, y: this.rows - 3 },     // פינה שמאל תחתון
            { x: this.cols - 3, y: this.rows - 3 }  // פינה ימין תחתון
        ];
        
        powerPelletPositions.forEach(pos => {
            if (pos.x > 0 && pos.x < this.cols && pos.y > 0 && pos.y < this.rows) {
                this.maze[pos.y][pos.x] = 2; // 2 = נקודה גדולה
            }
        });
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.pacman.direction = 'up';
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.pacman.direction = 'down';
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.pacman.direction = 'left';
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.pacman.direction = 'right';
                    break;
                case ' ':
                    this.paused = !this.paused;
                    break;
            }
        });
    }
    
    movePacman() {
        if (this.paused) return;
        
        let newX = this.pacman.x;
        let newY = this.pacman.y;
        
        switch(this.pacman.direction) {
            case 'up':
                newY--;
                break;
            case 'down':
                newY++;
                break;
            case 'left':
                newX--;
                break;
            case 'right':
                newX++;
                break;
        }
        
        // בדיקת גבולות ומכשולים
        if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows) {
            if (this.maze[newY][newX] !== 1) {
                this.pacman.x = newX;
                this.pacman.y = newY;
                
                // אכילת נקודה רגילה
                if (this.maze[newY][newX] === 0) {
                    this.maze[newY][newX] = -1; // מסמן שהנקודה נאכלה
                    this.score += 1;
                    this.scoreElement.textContent = this.score;
                } else if (this.maze[newY][newX] === 2) {
                    // אכילת נקודה גדולה (42 נקודות)
                    this.maze[newY][newX] = -1;
                    this.score += 42;
                    this.scoreElement.textContent = this.score;
                }
            }
        }
        
        // החלפת מצב הפה
        this.pacman.mouthOpen = !this.pacman.mouthOpen;
    }
    
    moveGhosts() {
        if (this.paused) return;
        
        this.ghosts.forEach(ghost => {
            // הפחתת האגרסיביות - לפעמים המפלצות יזוזו אקראית
            const chaseChance = Math.random();
            
            let targetDirection = ghost.direction;
            
            // רק 60% מהזמן המפלצות ירדפו אחרי פקמן
            if (chaseChance < 0.6) {
                // חישוב המרחק לפקמן
                const dx = this.pacman.x - ghost.x;
                const dy = this.pacman.y - ghost.y;
                
                // בחירת כיוון לפי המרחק הקצר ביותר לפקמן
                if (Math.abs(dx) > Math.abs(dy)) {
                    // פקמן רחוק יותר אופקית
                    targetDirection = dx > 0 ? 'right' : 'left';
                } else {
                    // פקמן רחוק יותר אנכית
                    targetDirection = dy > 0 ? 'down' : 'up';
                }
            } else {
                // 40% מהזמן תנועה אקראית
                const directions = ['up', 'down', 'left', 'right'];
                targetDirection = directions[Math.floor(Math.random() * directions.length)];
            }
            
            // נסיון תנועה בכיוון המטרה
            let newX = ghost.x;
            let newY = ghost.y;
            
            switch(targetDirection) {
                case 'up':
                    newY--;
                    break;
                case 'down':
                    newY++;
                    break;
                case 'left':
                    newX--;
                    break;
                case 'right':
                    newX++;
                    break;
            }
            
            // בדיקה אם יכול לזוז בכיוון המטרה (כולל בדיקת מפלצות אחרות)
            if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows && 
                this.maze[newY][newX] !== 1 && 
                !this.isGhostAtPosition(newX, newY, ghost)) {
                ghost.x = newX;
                ghost.y = newY;
                ghost.direction = targetDirection;
            } else {
                // אם לא יכול לזוז בכיוון המטרה, נסה כיוונים אחרים
                const alternativeDirections = ['up', 'down', 'left', 'right']
                    .filter(dir => dir !== targetDirection);
                
                let moved = false;
                for (let dir of alternativeDirections) {
                    newX = ghost.x;
                    newY = ghost.y;
                    
                    switch(dir) {
                        case 'up':
                            newY--;
                            break;
                        case 'down':
                            newY++;
                            break;
                        case 'left':
                            newX--;
                            break;
                        case 'right':
                            newX++;
                            break;
                    }
                    
                    if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows && 
                        this.maze[newY][newX] !== 1 && 
                        !this.isGhostAtPosition(newX, newY, ghost)) {
                        ghost.x = newX;
                        ghost.y = newY;
                        ghost.direction = dir;
                        moved = true;
                        break;
                    }
                }
                
                // אם עדיין לא זז,Change random direction
                if (!moved) {
                    const directions = ['up', 'down', 'left', 'right'];
                    ghost.direction = directions[Math.floor(Math.random() * directions.length)];
                }
            }
        });
    }
    
    // פונקציה לבדיקה אם יש מפלצת במיקום מסוים
    isGhostAtPosition(x, y, excludeGhost) {
        return this.ghosts.some(ghost => 
            ghost !== excludeGhost && ghost.x === x && ghost.y === y
        );
    }
    
    checkCollisions() {
        // בדיקת התנגשות עם רוחות
        this.ghosts.forEach(ghost => {
            if (ghost.x === this.pacman.x && ghost.y === this.pacman.y) {
                this.lives--;
                this.livesElement.textContent = this.lives;
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    // איפוס מיקום פקמן
                    this.pacman.x = 1;
                    this.pacman.y = 1;
                }
            }
        });
    }
    
    draw() {
        // ניקוי המסך
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // רישום המבוך והנקודות
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                
                if (this.maze[row][col] === 1) {
                    // קיר
                    this.ctx.fillStyle = '#0000ff';
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (this.maze[row][col] === 0) {
                    // נקודה רגילה
                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.beginPath();
                    this.ctx.arc(x + this.cellSize/2, y + this.cellSize/2, 3, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (this.maze[row][col] === 2) {
                    // נקודה גדולה (42 נקודות)
                    this.ctx.fillStyle = '#ff6600';
                    this.ctx.beginPath();
                    this.ctx.arc(x + this.cellSize/2, y + this.cellSize/2, 8, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // הוספת אפקט זוהר
                    this.ctx.fillStyle = '#ffaa44';
                    this.ctx.beginPath();
                    this.ctx.arc(x + this.cellSize/2, y + this.cellSize/2, 6, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        
        // רישום פקמן
        this.drawPacman();
        
        // רישום רוחות
        this.ghosts.forEach(ghost => this.drawGhost(ghost));
        
        // הודעת השהיה
        if (this.paused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('השהיה', this.canvas.width/2, this.canvas.height/2);
        }
    }
    
    drawPacman() {
        const x = this.pacman.x * this.cellSize + this.cellSize/2;
        const y = this.pacman.y * this.cellSize + this.cellSize/2;
        const radius = this.cellSize/2 - 3;
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        
        if (this.pacman.mouthOpen) {
            let startAngle, endAngle;
            switch(this.pacman.direction) {
                case 'right':
                    startAngle = 0.2 * Math.PI;
                    endAngle = 1.8 * Math.PI;
                    break;
                case 'left':
                    startAngle = 1.2 * Math.PI;
                    endAngle = 0.8 * Math.PI;
                    break;
                case 'up':
                    startAngle = 1.7 * Math.PI;
                    endAngle = 1.3 * Math.PI;
                    break;
                case 'down':
                    startAngle = 0.7 * Math.PI;
                    endAngle = 0.3 * Math.PI;
                    break;
            }
            this.ctx.arc(x, y, radius, startAngle, endAngle);
            this.ctx.lineTo(x, y);
        } else {
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        
        this.ctx.fill();
    }
    
    drawGhost(ghost) {
        const x = ghost.x * this.cellSize + this.cellSize/2;
        const y = ghost.y * this.cellSize + this.cellSize/2;
        const radius = this.cellSize/2 - 3;
        
        this.ctx.fillStyle = ghost.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, Math.PI, 0);
        this.ctx.lineTo(x + radius, y + radius);
        this.ctx.lineTo(x + radius/2, y + radius - 4);
        this.ctx.lineTo(x, y + radius);
        this.ctx.lineTo(x - radius/2, y + radius - 4);
        this.ctx.lineTo(x - radius, y + radius);
        this.ctx.closePath();
        this.ctx.fill();
        
        // עיניים
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(x - radius/3, y - radius/3, radius/6, 0, Math.PI * 2);
        this.ctx.arc(x + radius/3, y - radius/3, radius/6, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(x - radius/3, y - radius/3, radius/12, 0, Math.PI * 2);
        this.ctx.arc(x + radius/3, y - radius/3, radius/12, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    gameOver() {
        this.gameRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        // וידוא שתמיד יהיו 4 מפלצות
        this.ensureFourGhosts();
        
        this.movePacman();
        this.moveGhosts();
        this.checkCollisions();
        this.draw();
        
        setTimeout(() => {
            this.gameLoop();
        }, 250); // האטה מ-200 ל-250 מילישניות
    }
}

// פונקציות גלובליות
function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    new PacmanGame();
}

function toggleFullscreen() {
    const canvas = document.getElementById('gameCanvas');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            // מניעת גלילה במסך מלא
            document.body.style.overflow = 'hidden';
            
            // התאמת הקנבס למסך מלא - רק המשחק נראה
            setTimeout(() => {
                canvas.style.position = 'fixed';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100vw';
                canvas.style.height = '100vh';
                canvas.style.zIndex = '9999';
                canvas.style.objectFit = 'contain';
                canvas.style.backgroundColor = '#000';
                
                // עדכון כפתור
                fullscreenBtn.textContent = 'יציאה ממסך מלא';
            }, 100);
        }).catch(err => {
            console.log('לא ניתן להיכנס למסך מלא:', err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                // החזרת גודל הקנבס המקורי
                canvas.style.position = '';
                canvas.style.top = '';
                canvas.style.left = '';
                canvas.style.width = '';
                canvas.style.height = '';
                canvas.style.zIndex = '';
                canvas.style.objectFit = '';
                canvas.style.backgroundColor = '';
                document.body.style.overflow = '';
                
                // עדכון כפתור
                fullscreenBtn.textContent = 'מסך מלא';
            });
        }
    }
}

// התחלת המשחק
window.addEventListener('load', () => {
    new PacmanGame();
});

// טיפול בשינויי מסך מלא
document.addEventListener('fullscreenchange', () => {
    const canvas = document.getElementById('gameCanvas');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (!document.fullscreenElement) {
        // יציאה ממסך מלא - החזרת גודל מקורי
        canvas.style.position = '';
        canvas.style.top = '';
        canvas.style.left = '';
        canvas.style.width = '';
        canvas.style.height = '';
        canvas.style.zIndex = '';
        canvas.style.objectFit = '';
        canvas.style.backgroundColor = '';
        document.body.style.overflow = '';
        fullscreenBtn.textContent = 'מסך מלא';
    } else {
        fullscreenBtn.textContent = 'יציאה ממסך מלא';
    }
});

// מניעת גלילה במקלדת במסך מלא
document.addEventListener('keydown', (e) => {
    if (document.fullscreenElement && 
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
    }
});
<meta name="google-site-verification" content="PfT9dqQLvFPsMakWq-rOru6yvCkxMoxpqNqjMvojf6Y" />
