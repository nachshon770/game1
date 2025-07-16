// משחק פקמן פשוט
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
        
        // 4 מפלצות רגילות - תמיד במקומות שונים
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
        // יצירת מבוך פשוט
        this.maze = [];
        for (let row = 0; row < this.rows; row++) {
            this.maze[row] = [];
            for (let col = 0; col < this.cols; col++) {
                if (row === 0 || row === this.rows - 1 || col === 0 || col === this.cols - 1) {
                    this.maze[row][col] = 1; // קיר
                } else if (row % 4 === 0 && col % 4 === 0) {
                    this.maze[row][col] = 1; // קיר פנימי
                } else if ((row % 4 === 2 && col % 8 === 4) || (col % 4 === 2 && row % 8 === 4)) {
                    this.maze[row][col] = 1; // קירות נוספים
                } else {
                    this.maze[row][col] = 0; // מסדרון עם נקודה
                }
            }
        }
        
        // ניקוי אזור ההתחלה של פקמן
        this.maze[1][1] = 0;
        this.maze[1][2] = 0;
        this.maze[2][1] = 0;
        
        // ניקוי אזור הרוחות
        for (let i = 0; i < this.ghosts.length; i++) {
            const ghost = this.ghosts[i];
            this.maze[ghost.y][ghost.x] = 0;
        }
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
                }
            }
        }
        
        // הזזת הפה
        this.pacman.mouthOpen = !this.pacman.mouthOpen;
    }
    
    moveGhosts() {
        if (this.paused) return;
        
        this.ghosts.forEach(ghost => {
            // רדיפה פשוטה אחרי פקמן
            const dx = this.pacman.x - ghost.x;
            const dy = this.pacman.y - ghost.y;
            
            let newX = ghost.x;
            let newY = ghost.y;
            
            // תנועה לכיוון פקמן
            if (Math.abs(dx) > Math.abs(dy)) {
                newX += dx > 0 ? 1 : -1;
            } else {
                newY += dy > 0 ? 1 : -1;
            }
            
            // בדיקה אם יכול לזוז
            if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows && 
                this.maze[newY][newX] !== 1) {
                ghost.x = newX;
                ghost.y = newY;
            } else {
                // תנועה אקראית אם לא יכול לרדוף
                const directions = [
                    {x: ghost.x + 1, y: ghost.y},
                    {x: ghost.x - 1, y: ghost.y},
                    {x: ghost.x, y: ghost.y + 1},
                    {x: ghost.x, y: ghost.y - 1}
                ];
                
                const validMoves = directions.filter(move => 
                    move.x >= 0 && move.x < this.cols && 
                    move.y >= 0 && move.y < this.rows && 
                    this.maze[move.y][move.x] !== 1
                );
                
                if (validMoves.length > 0) {
                    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                    ghost.x = randomMove.x;
                    ghost.y = randomMove.y;
                }
            }
        });
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
        }, 200);
    }
}

// פונקציות גלובליות
function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    new PacmanGame();
}

function toggleFullscreen() {
    const canvas = document.getElementById('gameCanvas');
    
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            // מניעת גלילה במסך מלא
            document.body.style.overflow = 'hidden';
            
            // התאמת גודל הקנבס למסך מלא כדי לכסות את כל המסך
            setTimeout(() => {
                canvas.style.position = 'fixed';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100vw';
                canvas.style.height = '100vh';
                canvas.style.zIndex = '9999';
                canvas.style.objectFit = 'contain';
                canvas.style.backgroundColor = '#000';
                
                // עדכון כפתור המסך המלא
                document.getElementById('fullscreenBtn').textContent = 'יציאה ממסך מלא';
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
                
                // עדכון כפתור המסך המלא
                document.getElementById('fullscreenBtn').textContent = 'מסך מלא';
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
