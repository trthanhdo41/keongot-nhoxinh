// Kham Pha Interactive Features
console.log('Kham Pha JS loaded!');

// User Data Management
class UserProgress {
    constructor() {
        this.storageKey = 'keongot_user_progress';
        this.initData();
    }

    initData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultData = {
                currentPoints: 0,
                badges: [],
                level: 1,
                completedQuizzes: 0,
                readStories: [],
                weeklyProgress: 0,
                quizScores: [],
                totalStoriesRead: 0,
                totalQuizzesCompleted: 0,
                averageScore: 0,
                lastActivity: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    updateData(updates) {
        const data = this.getData();
        const newData = { ...data, ...updates, lastActivity: new Date().toISOString() };
        localStorage.setItem(this.storageKey, JSON.stringify(newData));
        this.updateUI();
    }

    addPoints(points) {
        const data = this.getData();
        const newPoints = data.currentPoints + points;
        const newLevel = Math.floor(newPoints / 500) + 1;
        this.updateData({ 
            currentPoints: newPoints,
            level: newLevel
        });
    }

    addBadge(badgeId) {
        const data = this.getData();
        if (!data.badges.includes(badgeId)) {
            this.updateData({ 
                badges: [...data.badges, badgeId]
            });
            
            // Add special unlock animation
            this.showBadgeUnlockAnimation(badgeId);
        }
    }
    
    showBadgeUnlockAnimation(badgeId) {
        // Find the badge element
        const badgeElement = document.querySelector(`[data-badge="${badgeId}"]`);
        if (badgeElement) {
            // Add celebration effect
            badgeElement.classList.add('badge-unlock-celebration');
            
            // Create confetti effect
            this.createConfettiEffect(badgeElement);
            
            // Remove celebration class after animation
            setTimeout(() => {
                badgeElement.classList.remove('badge-unlock-celebration');
            }, 3000);
        }
    }
    
    createConfettiEffect(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#4ECDC4', '#44A08D', '#26D0CE', '#FFD700', '#FF6B6B', '#4ECDC4'];
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = rect.left + rect.width / 2 + 'px';
            confetti.style.top = rect.top + rect.height / 2 + 'px';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            
            // Random direction and speed
            const angle = Math.random() * 360;
            const velocity = 50 + Math.random() * 100;
            const vx = Math.cos(angle * Math.PI / 180) * velocity;
            const vy = Math.sin(angle * Math.PI / 180) * velocity;
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            let x = 0, y = 0;
            const animate = () => {
                x += vx * 0.02;
                y += vy * 0.02 + 0.5; // gravity
                confetti.style.transform = `translate(${x}px, ${y}px)`;
                confetti.style.opacity = 1 - (y / 200);
                
                if (y < 200 && confetti.style.opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    completeQuiz(score) {
        const data = this.getData();
        const newScores = [...data.quizScores, score];
        const averageScore = newScores.reduce((a, b) => a + b, 0) / newScores.length;
        
        // Check for emotion expert badge BEFORE updating totalQuizzesCompleted
        if (data.totalQuizzesCompleted === 0 && score >= 70) {
            this.addBadge('emotion_expert');
        }
        
        this.updateData({
            completedQuizzes: data.completedQuizzes + 1,
            totalQuizzesCompleted: data.totalQuizzesCompleted + 1,
            quizScores: newScores,
            averageScore: Math.round(averageScore * 10) / 10
        });

        // Add points based on score
        const points = Math.round(score * 20);
        this.addPoints(points);

        // Check for badge achievements
        
        if (data.totalQuizzesCompleted + 1 >= 5) {
            this.addBadge('quiz_master');
        }
        
        // Check for explorer badge (complete all activities)
        if (data.totalStoriesRead >= 6 && data.totalQuizzesCompleted + 1 >= 5) {
            this.addBadge('explorer');
        }
    }

    readStory(storyId) {
        const data = this.getData();
        if (!data.readStories.includes(storyId)) {
            this.updateData({
                readStories: [...data.readStories, storyId],
                totalStoriesRead: data.totalStoriesRead + 1
            });

            // Add points for reading story
            this.addPoints(50);

            // Check for badge achievements
            if (data.totalStoriesRead + 1 >= 6) {
                this.addBadge('bookworm');
            }
            
            // Check for storyteller badge (read all stories and complete quizzes)
            if (data.totalStoriesRead >= 6 && data.totalQuizzesCompleted >= 3) {
                this.addBadge('storyteller');
            }
            
            // Check for helper badge (help others by sharing progress)
            if (data.totalStoriesRead >= 4 && data.totalQuizzesCompleted >= 2) {
                this.addBadge('helper');
            }
        }
    }

    updateUI() {
        const data = this.getData();
        
        // Update points display
        const pointsElement = document.getElementById('currentPoints');
        if (pointsElement) {
            pointsElement.textContent = data.currentPoints.toLocaleString();
        }

        // Update level display
        const levelElement = document.getElementById('currentLevel');
        if (levelElement) {
            levelElement.textContent = `Cấp ${data.level}`;
        }

        // Update badge count
        const badgeElement = document.getElementById('badgeCount');
        if (badgeElement) {
            badgeElement.textContent = `${data.badges.length}/6`;
        }

        // Update progress stats in the progress section
        const storyProgress = document.querySelector('.progress-item:nth-child(1) .progress-value');
        if (storyProgress) {
            storyProgress.textContent = `${data.totalStoriesRead}/6`;
        }

        const quizProgress = document.querySelector('.progress-item:nth-child(2) .progress-value');
        if (quizProgress) {
            quizProgress.textContent = `${data.totalQuizzesCompleted}/5`;
        }

        const avgScore = document.querySelector('.progress-item:nth-child(3) .progress-value');
        if (avgScore) {
            avgScore.textContent = `${data.averageScore}/10`;
        }

        // Update weekly progress
        const weeklyProgress = Math.min((data.totalStoriesRead + data.totalQuizzesCompleted) * 15, 100);
        
        // Update circular progress ring
        const progressCircle = document.querySelector('.progress-ring-circle');
        if (progressCircle) {
            const circumference = 2 * Math.PI * 50; // radius = 50
            const offset = circumference - (weeklyProgress / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        // Update progress text
        const progressPercentage = document.querySelector('.progress-ring-percentage');
        if (progressPercentage) {
            progressPercentage.textContent = weeklyProgress + '%';
        }

        // Animate progress chart
        this.animateProgressChart(weeklyProgress);

        // Update badge display
        this.updateBadgeDisplay(data.badges);
    }

    updateBadgeDisplay(earnedBadges) {
        const badgeItems = document.querySelectorAll('.badge-item');
        const badgeIcons = [
            'fas fa-bullseye',
            'fas fa-book', 
            'fas fa-heart',
            'fas fa-pen-fancy',
            'fas fa-hands-helping',
            'fas fa-search'
        ];
        
        badgeItems.forEach((item, index) => {
            const badgeIds = ['quiz_master', 'bookworm', 'emotion_expert', 'storyteller', 'helper', 'explorer'];
            const badgeId = badgeIds[index];
            
            if (earnedBadges.includes(badgeId)) {
                item.classList.remove('locked');
                item.classList.add('earned');
                item.setAttribute('data-badge', badgeId);
                const icon = item.querySelector('.badge-icon i');
                if (icon) {
                    icon.className = badgeIcons[index];
                }
            } else {
                item.classList.add('locked');
                item.classList.remove('earned');
                item.removeAttribute('data-badge');
                const icon = item.querySelector('.badge-icon i');
                if (icon) {
                    icon.className = 'fas fa-lock';
                }
            }
        });
    }
    
    animateProgressChart(percentage) {
        const chartFill = document.getElementById('chartFill');
        const chartPercentage = document.getElementById('chartPercentage');
        const milestones = document.querySelectorAll('.milestone');
        
        if (!chartFill || !chartPercentage) return;
        
        // Reset to 0
        chartFill.style.width = '0%';
        chartPercentage.textContent = '0%';
        
        // Animate to target percentage
        setTimeout(() => {
            chartFill.style.width = `${percentage}%`;
            chartPercentage.textContent = `${percentage}%`;
            
            // Add bounce animation to percentage
            chartPercentage.classList.add('animate');
            setTimeout(() => {
                chartPercentage.classList.remove('animate');
            }, 600);
            
            // Activate milestones based on percentage
            milestones.forEach(milestone => {
                const milestonePercent = parseInt(milestone.dataset.percent);
                if (percentage >= milestonePercent) {
                    milestone.classList.add('active');
                } else {
                    milestone.classList.remove('active');
                }
            });
            
            // Add sparkles if 100%
            if (percentage >= 100) {
                this.addSparkles();
            }
        }, 100);
    }
    
    addSparkles() {
        const sparklesContainer = document.getElementById('chartSparkles');
        if (!sparklesContainer) return;
        
        // Create multiple sparkles
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '14px';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 20 + 'px';
            sparkle.style.animation = `sparkle 1.5s infinite`;
            sparkle.style.animationDelay = Math.random() * 1 + 's';
            sparkle.style.pointerEvents = 'none';
            
            sparklesContainer.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 3000);
        }
    }
}

// Initialize user progress
const userProgress = new UserProgress();

// Quiz System - Split into smaller quizzes
const QUIZ_SIZE = 10; // 10 questions per quiz
const quizData = [
    {
        question: "Khi bạn cảm thấy buồn, bạn thường làm gì?",
        options: [
            "Khóc và chia sẻ với người thân",
            "Nghe nhạc buồn và ở một mình", 
            "Tìm cách làm việc khác để quên đi",
            "Vẽ tranh hoặc viết nhật ký"
        ],
        correct: 0,
        explanation: "Chia sẻ cảm xúc với người thân là cách tốt để xử lý cảm xúc buồn một cách lành mạnh."
    },
    {
        question: "Cảm xúc nào giúp bạn học tập tốt nhất?",
        options: [
            "Vui vẻ và hứng thú",
            "Lo lắng và căng thẳng",
            "Buồn bã và chán nản",
            "Tức giận và bực bội"
        ],
        correct: 0,
        explanation: "Khi vui vẻ và hứng thú, não bộ hoạt động tốt nhất và bạn sẽ học hiệu quả hơn."
    },
    {
        question: "Khi bạn tức giận, điều gì nên làm trước tiên?",
        options: [
            "Hít thở sâu và đếm đến 10",
            "Nói ngay những gì bạn nghĩ",
            "Đánh gối hoặc đá đồ vật",
            "Im lặng và giữ trong lòng"
        ],
        correct: 0,
        explanation: "Hít thở sâu giúp bạn bình tĩnh và suy nghĩ rõ ràng hơn trước khi hành động."
    },
    {
        question: "Cảm xúc nào là bình thường và cần thiết?",
        options: [
            "Tất cả cảm xúc đều bình thường",
            "Chỉ có vui và buồn",
            "Chỉ có vui, không nên có cảm xúc khác",
            "Cảm xúc là dấu hiệu của yếu đuối"
        ],
        correct: 0,
        explanation: "Tất cả cảm xúc đều là phản ứng bình thường và cần thiết của con người."
    },
    {
        question: "Khi bạn thấy bạn bè buồn, bạn nên làm gì?",
        options: [
            "Lắng nghe và hỏi thăm",
            "Bỏ qua vì không liên quan",
            "Chế giễu và trêu chọc",
            "Bắt bạn phải vui lên ngay"
        ],
        correct: 0,
        explanation: "Lắng nghe và hỏi thăm là cách tốt nhất để hỗ trợ bạn bè khi họ buồn."
    },
    {
        question: "Khi bạn cảm thấy lo lắng trước kỳ thi, bạn nên:",
        options: [
            "Bỏ học và chơi game",
            "Chuẩn bị kỹ lưỡng và thở sâu",
            "Lo lắng suốt đêm không ngủ",
            "Nhờ người khác làm bài giúp"
        ],
        correct: 1,
        explanation: "Chuẩn bị kỹ lưỡng giúp bạn tự tin hơn, và thở sâu giúp giảm lo lắng. Đây là cách tích cực để đối mặt với áp lực thi cử."
    },
    {
        question: "Cảm xúc 'ghen tị' có nghĩa là gì?",
        options: [
            "Vui vẻ khi bạn bè thành công",
            "Buồn khi mình không bằng bạn",
            "Tức giận khi bị đối xử không công bằng",
            "Sợ hãi khi gặp người lạ"
        ],
        correct: 1,
        explanation: "Ghen tị là cảm xúc buồn khi mình không bằng người khác. Đây là cảm xúc bình thường, nhưng cần học cách chuyển hóa thành động lực tích cực."
    },
    {
        question: "Khi bạn cảm thấy tự hào về thành tích của mình, bạn nên:",
        options: [
            "Khoe khoang với mọi người",
            "Chia sẻ niềm vui một cách khiêm tốn",
            "Giấu kín không cho ai biết",
            "Cảm thấy xấu hổ về thành tích"
        ],
        correct: 1,
        explanation: "Chia sẻ niềm vui một cách khiêm tốn là cách tốt nhất. Điều này giúp bạn cảm thấy hạnh phúc mà không làm người khác khó chịu."
    },
    {
        question: "Cảm xúc 'biết ơn' giúp bạn như thế nào?",
        options: [
            "Làm bạn cảm thấy buồn bã",
            "Giúp bạn cảm thấy hạnh phúc và tích cực",
            "Làm bạn cảm thấy lo lắng",
            "Khiến bạn cảm thấy tức giận"
        ],
        correct: 1,
        explanation: "Cảm xúc biết ơn giúp bạn nhận ra những điều tốt đẹp trong cuộc sống, từ đó cảm thấy hạnh phúc và tích cực hơn."
    },
    {
        question: "Khi bạn cảm thấy căng thẳng, cách nào giúp bạn thư giãn?",
        options: [
            "Xem TV cả ngày",
            "Hít thở sâu và nghe nhạc nhẹ",
            "Ăn nhiều đồ ngọt",
            "Chơi game liên tục"
        ],
        correct: 1,
        explanation: "Hít thở sâu và nghe nhạc nhẹ giúp cơ thể và tâm trí thư giãn, giảm căng thẳng một cách tự nhiên."
    },
    {
        question: "Khi bạn cảm thấy thất vọng, bạn nên:",
        options: [
            "Bỏ cuộc ngay lập tức",
            "Nghĩ về những thành công trước đó",
            "Đổ lỗi cho người khác",
            "Tránh né mọi thứ"
        ],
        correct: 1,
        explanation: "Nghĩ về những thành công trước đó giúp bạn lấy lại tự tin và động lực để tiếp tục cố gắng."
    },
    {
        question: "Cách nào giúp bạn kiểm soát cảm xúc tốt nhất?",
        options: [
            "Giấu kín mọi cảm xúc",
            "Nhận biết và chấp nhận cảm xúc",
            "Bỏ qua cảm xúc",
            "Thể hiện cảm xúc mạnh mẽ"
        ],
        correct: 1,
        explanation: "Nhận biết và chấp nhận cảm xúc là bước đầu tiên để học cách quản lý chúng một cách tích cực."
    },
    {
        question: "Khi bạn cảm thấy bị hiểu lầm, bạn nên:",
        options: [
            "Tức giận và không nói gì",
            "Bình tĩnh giải thích rõ ràng",
            "Tránh né người đó",
            "La hét để chứng minh mình đúng"
        ],
        correct: 1,
        explanation: "Bình tĩnh giải thích rõ ràng giúp người khác hiểu bạn hơn và tránh xung đột không cần thiết."
    },
    {
        question: "Cảm xúc 'xấu hổ' thường xuất hiện khi nào?",
        options: [
            "Khi bạn thành công",
            "Khi bạn mắc lỗi trước mặt người khác",
            "Khi bạn giúp đỡ người khác",
            "Khi bạn học tập tốt"
        ],
        correct: 1,
        explanation: "Cảm xúc xấu hổ thường xuất hiện khi chúng ta mắc lỗi hoặc làm điều gì đó không đúng trước mặt người khác."
    },
    {
        question: "Khi bạn cảm thấy ghen tị với bạn bè, bạn nên:",
        options: [
            "Cố gắng làm hại bạn",
            "Học hỏi từ thành công của bạn",
            "Tránh né bạn đó",
            "Nói xấu bạn với người khác"
        ],
        correct: 1,
        explanation: "Học hỏi từ thành công của bạn là cách tích cực để chuyển hóa cảm xúc ghen tị thành động lực phát triển bản thân."
    },
    {
        question: "Cảm xúc 'tự tin' giúp bạn như thế nào?",
        options: [
            "Làm bạn kiêu ngạo",
            "Giúp bạn dễ dàng đối mặt với thử thách",
            "Khiến bạn không cần học hỏi",
            "Làm bạn xa lánh bạn bè"
        ],
        correct: 1,
        explanation: "Cảm xúc tự tin giúp bạn dễ dàng đối mặt với thử thách và không sợ hãi khi thử những điều mới."
    },
    {
        question: "Khi bạn cảm thấy cô đơn, bạn nên:",
        options: [
            "Ở một mình mãi mãi",
            "Tìm cách kết nối với người khác",
            "Xem TV cả ngày",
            "Chơi game liên tục"
        ],
        correct: 1,
        explanation: "Tìm cách kết nối với người khác giúp bạn vượt qua cảm giác cô đơn và xây dựng những mối quan hệ tích cực."
    },
    {
        question: "Cảm xúc 'thất vọng' có thể chuyển hóa thành gì?",
        options: [
            "Tức giận và hận thù",
            "Động lực để cố gắng hơn",
            "Buồn bã và chán nản",
            "Sợ hãi và tránh né"
        ],
        correct: 1,
        explanation: "Cảm xúc thất vọng có thể chuyển hóa thành động lực để cố gắng hơn và học hỏi từ những sai lầm."
    },
    {
        question: "Khi bạn cảm thấy hạnh phúc, bạn nên:",
        options: [
            "Giấu kín không cho ai biết",
            "Chia sẻ niềm vui với người thân",
            "Khoe khoang với mọi người",
            "Cảm thấy xấu hổ"
        ],
        correct: 1,
        explanation: "Chia sẻ niềm vui với người thân giúp bạn cảm thấy hạnh phúc hơn và lan tỏa năng lượng tích cực."
    },
    {
        question: "Khi bạn không hiểu bài học, bạn cảm thấy gì?",
        options: [
            "Tức giận với giáo viên",
            "Thất vọng và muốn bỏ cuộc",
            "Lo lắng nhưng muốn tìm hiểu thêm",
            "Buồn bã và khóc"
        ],
        correct: 2,
        explanation: "Cảm thấy lo lắng nhưng muốn tìm hiểu thêm là phản ứng tích cực, giúp bạn có động lực để học hỏi."
    },
    {
        question: "Khi bạn được điểm cao, bạn nên:",
        options: [
            "Khoe khoang với mọi người",
            "Tự hào và tiếp tục cố gắng",
            "Cảm thấy xấu hổ",
            "Giấu kín không cho ai biết"
        ],
        correct: 1,
        explanation: "Tự hào về thành tích và tiếp tục cố gắng là cách tích cực để duy trì động lực học tập."
    },
    {
        question: "Khi bạn bị điểm kém, bạn nên:",
        options: [
            "Tức giận và đổ lỗi cho giáo viên",
            "Buồn bã và bỏ cuộc",
            "Thất vọng nhưng tìm cách cải thiện",
            "Giấu kín không cho ai biết"
        ],
        correct: 2,
        explanation: "Thất vọng nhưng tìm cách cải thiện là phản ứng tích cực, giúp bạn học hỏi từ sai lầm và tiến bộ."
    },
    {
        question: "Cảm xúc nào giúp bạn tập trung học tập tốt nhất?",
        options: [
            "Lo lắng và căng thẳng",
            "Bình tĩnh và tập trung",
            "Tức giận và bực bội",
            "Buồn bã và chán nản"
        ],
        correct: 1,
        explanation: "Bình tĩnh và tập trung giúp não bộ hoạt động tốt nhất, giúp bạn tiếp thu kiến thức hiệu quả."
    },
    {
        question: "Khi bạn cảm thấy áp lực thi cử, bạn nên:",
        options: [
            "Bỏ học và chơi game",
            "Thở sâu và lập kế hoạch học tập",
            "Lo lắng suốt đêm",
            "Nhờ người khác làm bài giúp"
        ],
        correct: 1,
        explanation: "Thở sâu và lập kế hoạch học tập giúp bạn giảm áp lực và có phương hướng rõ ràng để chuẩn bị thi."
    },
    {
        question: "Khi bạn không hiểu bài của bạn bè, bạn nên:",
        options: [
            "Cảm thấy xấu hổ và không hỏi",
            "Hỏi bạn để học hỏi thêm",
            "Tức giận vì mình kém hơn",
            "Tránh né bạn đó"
        ],
        correct: 1,
        explanation: "Hỏi bạn để học hỏi thêm là cách tích cực để cải thiện kiến thức và xây dựng tình bạn."
    },
    {
        question: "Cảm xúc 'tò mò' giúp bạn như thế nào trong học tập?",
        options: [
            "Làm bạn mất tập trung",
            "Giúp bạn muốn tìm hiểu thêm",
            "Khiến bạn lo lắng",
            "Làm bạn cảm thấy mệt mỏi"
        ],
        correct: 1,
        explanation: "Cảm xúc tò mò giúp bạn muốn tìm hiểu thêm, từ đó học hỏi được nhiều kiến thức mới."
    },
    {
        question: "Khi bạn cảm thấy chán nản với môn học, bạn nên:",
        options: [
            "Bỏ học môn đó",
            "Tìm cách làm cho môn học thú vị hơn",
            "Đổ lỗi cho giáo viên",
            "Chỉ học khi bị ép buộc"
        ],
        correct: 1,
        explanation: "Tìm cách làm cho môn học thú vị hơn giúp bạn tìm lại hứng thú và động lực học tập."
    },
    {
        question: "Cảm xúc 'tự hào' khi hoàn thành bài tập giúp bạn:",
        options: [
            "Trở nên kiêu ngạo",
            "Có động lực để tiếp tục học",
            "Xa lánh bạn bè",
            "Không cần học thêm nữa"
        ],
        correct: 1,
        explanation: "Cảm xúc tự hào khi hoàn thành bài tập giúp bạn có động lực để tiếp tục học và cố gắng hơn."
    },
    {
        question: "Khi bạn bè tức giận với bạn, bạn nên:",
        options: [
            "Tức giận lại và không nói chuyện",
            "Bình tĩnh hỏi lý do và xin lỗi",
            "Tránh né bạn đó",
            "Nói xấu bạn với người khác"
        ],
        correct: 1,
        explanation: "Bình tĩnh hỏi lý do và xin lỗi giúp bạn hiểu rõ vấn đề và hàn gắn tình bạn."
    },
    {
        question: "Khi bạn cảm thấy ghen tị với thành công của bạn, bạn nên:",
        options: [
            "Cố gắng làm hại bạn",
            "Chúc mừng và học hỏi từ bạn",
            "Tránh né bạn đó",
            "Nói xấu bạn với người khác"
        ],
        correct: 1,
        explanation: "Chúc mừng và học hỏi từ bạn là cách tích cực để duy trì tình bạn và phát triển bản thân."
    },
    {
        question: "Cảm xúc 'tin tưởng' trong tình bạn có nghĩa là gì?",
        options: [
            "Tin tưởng mù quáng",
            "Tin tưởng dựa trên hành động và lời nói",
            "Tin tưởng tất cả mọi người",
            "Không bao giờ tin tưởng ai"
        ],
        correct: 1,
        explanation: "Tin tưởng trong tình bạn dựa trên hành động và lời nói của bạn, giúp xây dựng mối quan hệ bền vững."
    },
    {
        question: "Khi bạn cảm thấy bị bạn bè bỏ rơi, bạn nên:",
        options: [
            "Tức giận và không nói chuyện",
            "Bình tĩnh hỏi lý do và tìm hiểu",
            "Tránh né tất cả bạn bè",
            "Nói xấu bạn với người khác"
        ],
        correct: 1,
        explanation: "Bình tĩnh hỏi lý do và tìm hiểu giúp bạn hiểu rõ tình hình và có thể hàn gắn tình bạn."
    },
    {
        question: "Cảm xúc 'ghen tị' trong tình bạn thường xuất hiện khi nào?",
        options: [
            "Khi bạn thành công",
            "Khi bạn có bạn mới",
            "Khi bạn được yêu thích",
            "Khi bạn có tài năng đặc biệt"
        ],
        correct: 1,
        explanation: "Cảm xúc ghen tị trong tình bạn thường xuất hiện khi bạn có bạn mới, sợ mất đi tình bạn hiện tại."
    },
    {
        question: "Khi bạn cảm thấy không được bạn bè hiểu, bạn nên:",
        options: [
            "Tức giận và không nói chuyện",
            "Chia sẻ cảm xúc và suy nghĩ với bạn",
            "Tránh né tất cả bạn bè",
            "Nói xấu bạn với người khác"
        ],
        correct: 1,
        explanation: "Chia sẻ cảm xúc và suy nghĩ với bạn giúp bạn được hiểu và xây dựng mối quan hệ sâu sắc hơn."
    },
    {
        question: "Cảm xúc 'thất vọng' khi bạn bè không giữ lời hứa, bạn nên:",
        options: [
            "Tức giận và không nói chuyện",
            "Bình tĩnh nói chuyện và tìm hiểu lý do",
            "Tránh né bạn đó",
            "Nói xấu bạn với người khác"
        ],
        correct: 1,
        explanation: "Bình tĩnh nói chuyện và tìm hiểu lý do giúp bạn hiểu rõ tình hình và có thể hàn gắn tình bạn."
    },
    {
        question: "Khi bạn cảm thấy tự hào về thành công của bạn, bạn nên:",
        options: [
            "Khoe khoang với mọi người",
            "Chia sẻ niềm vui một cách khiêm tốn",
            "Giấu kín không cho ai biết",
            "Cảm thấy xấu hổ"
        ],
        correct: 1,
        explanation: "Chia sẻ niềm vui một cách khiêm tốn giúp bạn cảm thấy hạnh phúc mà không làm người khác khó chịu."
    },
    {
        question: "Cảm xúc 'biết ơn' đối với bạn bè giúp bạn:",
        options: [
            "Trở nên kiêu ngạo",
            "Trân trọng và duy trì tình bạn",
            "Xa lánh bạn bè",
            "Không cần bạn bè nữa"
        ],
        correct: 1,
        explanation: "Cảm xúc biết ơn đối với bạn bè giúp bạn trân trọng và duy trì tình bạn, xây dựng mối quan hệ bền vững."
    },
    {
        question: "Khi bạn cảm thấy cô đơn trong nhóm bạn, bạn nên:",
        options: [
            "Tránh né tất cả bạn bè",
            "Tìm cách kết nối và tham gia hoạt động",
            "Tức giận và không nói chuyện",
            "Nói xấu bạn với người khác"
        ],
        correct: 1,
        explanation: "Tìm cách kết nối và tham gia hoạt động giúp bạn vượt qua cảm giác cô đơn và xây dựng mối quan hệ tốt hơn."
    },
    {
        question: "Khi bạn cảm thấy bị bố mẹ hiểu lầm, bạn nên:",
        options: [
            "Tức giận và không nói chuyện",
            "Bình tĩnh giải thích và lắng nghe",
            "Tránh né bố mẹ",
            "La hét để chứng minh mình đúng"
        ],
        correct: 1,
        explanation: "Bình tĩnh giải thích và lắng nghe giúp bố mẹ hiểu bạn hơn và tránh xung đột không cần thiết."
    },
    {
        question: "Cảm xúc 'tự hào' khi được bố mẹ khen ngợi giúp bạn:",
        options: [
            "Trở nên kiêu ngạo",
            "Có động lực để tiếp tục cố gắng",
            "Xa lánh bạn bè",
            "Không cần học thêm nữa"
        ],
        correct: 1,
        explanation: "Cảm xúc tự hào khi được bố mẹ khen ngợi giúp bạn có động lực để tiếp tục cố gắng và phát triển bản thân."
    },
    {
        question: "Khi bạn cảm thấy bị bố mẹ so sánh với anh chị em, bạn nên:",
        options: [
            "Tức giận và không nói chuyện",
            "Bình tĩnh nói chuyện và tìm hiểu lý do",
            "Tránh né bố mẹ",
            "Nói xấu anh chị em"
        ],
        correct: 1,
        explanation: "Bình tĩnh nói chuyện và tìm hiểu lý do giúp bạn hiểu rõ tình hình và có thể hàn gắn mối quan hệ."
    },
    {
        question: "Cảm xúc 'biết ơn' đối với bố mẹ giúp bạn:",
        options: [
            "Trở nên kiêu ngạo",
            "Trân trọng và yêu thương bố mẹ",
            "Xa lánh bố mẹ",
            "Không cần bố mẹ nữa"
        ],
        correct: 1,
        explanation: "Cảm xúc biết ơn đối với bố mẹ giúp bạn trân trọng và yêu thương bố mẹ, xây dựng mối quan hệ tốt đẹp."
    },
    {
        question: "Khi bạn cảm thấy bị bố mẹ ép buộc làm điều gì đó, bạn nên:",
        options: [
            "Tức giận và không làm",
            "Bình tĩnh nói chuyện và tìm hiểu lý do",
            "Tránh né bố mẹ",
            "La hét để chứng minh mình đúng"
        ],
        correct: 1,
        explanation: "Bình tĩnh nói chuyện và tìm hiểu lý do giúp bạn hiểu rõ tình hình và có thể thỏa thuận với bố mẹ."
    },
    {
        question: "Cảm xúc 'tự hào' khi giúp đỡ bố mẹ giúp bạn:",
        options: [
            "Trở nên kiêu ngạo",
            "Có động lực để tiếp tục giúp đỡ",
            "Xa lánh bạn bè",
            "Không cần học thêm nữa"
        ],
        correct: 1,
        explanation: "Cảm xúc tự hào khi giúp đỡ bố mẹ giúp bạn có động lực để tiếp tục giúp đỡ và xây dựng mối quan hệ tốt đẹp."
    },
    {
        question: "Khi bạn cảm thấy bị bố mẹ bỏ rơi, bạn nên:",
        options: [
            "Tức giận và không nói chuyện",
            "Bình tĩnh nói chuyện và tìm hiểu lý do",
            "Tránh né bố mẹ",
            "Nói xấu bố mẹ với người khác"
        ],
        correct: 1,
        explanation: "Bình tĩnh nói chuyện và tìm hiểu lý do giúp bạn hiểu rõ tình hình và có thể hàn gắn mối quan hệ."
    },
    {
        question: "Cảm xúc 'tự hào' khi được bố mẹ tin tưởng giúp bạn:",
        options: [
            "Trở nên kiêu ngạo",
            "Có động lực để tiếp tục cố gắng",
            "Xa lánh bạn bè",
            "Không cần học thêm nữa"
        ],
        correct: 1,
        explanation: "Cảm xúc tự hào khi được bố mẹ tin tưởng giúp bạn có động lực để tiếp tục cố gắng và phát triển bản thân."
    },
    {
        question: "Khi bạn cảm thấy bị bố mẹ hiểu lầm về cảm xúc, bạn nên:",
        options: [
            "Tức giận và không nói chuyện",
            "Chia sẻ cảm xúc và suy nghĩ với bố mẹ",
            "Tránh né bố mẹ",
            "La hét để chứng minh mình đúng"
        ],
        correct: 1,
        explanation: "Chia sẻ cảm xúc và suy nghĩ với bố mẹ giúp bạn được hiểu và xây dựng mối quan hệ sâu sắc hơn."
    },
    {
        question: "Cảm xúc 'biết ơn' đối với gia đình giúp bạn:",
        options: [
            "Trở nên kiêu ngạo",
            "Trân trọng và yêu thương gia đình",
            "Xa lánh gia đình",
            "Không cần gia đình nữa"
        ],
        correct: 1,
        explanation: "Cảm xúc biết ơn đối với gia đình giúp bạn trân trọng và yêu thương gia đình, xây dựng mối quan hệ tốt đẹp."
    },
    {
        question: "Khi bạn cảm thấy lo lắng trước kỳ thi, bạn nên:",
        options: [
            "Tránh né và không thi",
            "Chuẩn bị kỹ lưỡng và thở sâu",
            "Lo lắng suốt đêm không ngủ",
            "Nhờ người khác thi giúp"
        ],
        correct: 1,
        explanation: "Chuẩn bị kỹ lưỡng và thở sâu giúp bạn giảm lo lắng và tự tin hơn khi thi."
    },
    {
        question: "Cảm xúc 'hạnh phúc' khi đạt được mục tiêu giúp bạn:",
        options: [
            "Trở nên kiêu ngạo",
            "Có động lực để đặt mục tiêu mới",
            "Xa lánh bạn bè",
            "Không cần cố gắng nữa"
        ],
        correct: 1,
        explanation: "Cảm xúc hạnh phúc khi đạt được mục tiêu giúp bạn có động lực để đặt mục tiêu mới và tiếp tục phát triển."
    }
];

let currentQuestion = 0;
let score = 0;
let currentQuiz = 0; // Track which quiz we're on
let totalQuizzes = Math.ceil(quizData.length / QUIZ_SIZE);

// Function to get current quiz questions
function getCurrentQuizQuestions() {
    const startIndex = currentQuiz * QUIZ_SIZE;
    const endIndex = Math.min(startIndex + QUIZ_SIZE, quizData.length);
    return quizData.slice(startIndex, endIndex);
}

function initQuiz() {
    updateQuizDisplay();
    setupQuizEventListeners();
}

function updateQuizDisplay() {
    const currentQuizQuestions = getCurrentQuizQuestions();
    
    if (!currentQuizQuestions || currentQuestion >= currentQuizQuestions.length) {
        console.error('Quiz data not available or question index out of bounds');
        return;
    }
    
    const question = currentQuizQuestions[currentQuestion];
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');

    if (!progressFill || !progressText || !quizQuestion || !quizOptions) {
        console.error('Required quiz elements not found');
        return;
    }

    // Update progress
    const progress = ((currentQuestion + 1) / currentQuizQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Quiz ${currentQuiz + 1}/${totalQuizzes} - Câu ${currentQuestion + 1}/${currentQuizQuestions.length}`;

    // Update question
    quizQuestion.innerHTML = `<h4>${question.question}</h4>`;

    // Update options
    quizOptions.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'quiz-option';
        optionElement.setAttribute('data-answer', String.fromCharCode(65 + index));
        optionElement.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        quizOptions.appendChild(optionElement);
    });

    // Hide feedback
    const quizFeedback = document.getElementById('quizFeedback');
    if (quizFeedback) {
        quizFeedback.style.display = 'none';
    }
}

function setupQuizEventListeners() {
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');

    if (!quizOptions || !quizFeedback || !nextQuestionBtn) return;

    quizOptions.addEventListener('click', (e) => {
        if (e.target.closest('.quiz-option')) {
            const selectedOption = e.target.closest('.quiz-option');
            const selectedAnswer = selectedOption.getAttribute('data-answer');
            const correctAnswer = String.fromCharCode(65 + quizData[currentQuestion].correct);
            
            // Disable all options
            document.querySelectorAll('.quiz-option').forEach(option => {
                option.disabled = true;
                if (option.getAttribute('data-answer') === correctAnswer) {
                    option.classList.add('correct');
                } else if (option.getAttribute('data-answer') === selectedAnswer && selectedAnswer !== correctAnswer) {
                    option.classList.add('incorrect');
                }
            });

            // Show feedback
            const feedbackContent = quizFeedback.querySelector('.feedback-content');
            if (selectedAnswer === correctAnswer) {
                score++;
                feedbackContent.innerHTML = `
                    <div class="feedback-icon">🎉</div>
                    <h4>Chính xác!</h4>
                    <p>${quizData[currentQuestion].explanation}</p>
                `;
            } else {
                feedbackContent.innerHTML = `
                    <div class="feedback-icon">💡</div>
                    <h4>Chưa đúng!</h4>
                    <p>${quizData[currentQuestion].explanation}</p>
                `;
            }
            
            quizFeedback.style.display = 'block';
        }
    });

    nextQuestionBtn.addEventListener('click', () => {
        currentQuestion++;
        const currentQuizQuestions = getCurrentQuizQuestions();
        
        if (currentQuestion < currentQuizQuestions.length) {
            updateQuizDisplay();
        } else {
            // Quiz completed, show results
            showQuizResults();
        }
    });
}

        function showQuizResults() {
            const quizContainer = document.getElementById('quizContainer');
            const currentQuizQuestions = getCurrentQuizQuestions();
            const percentage = Math.round((score / currentQuizQuestions.length) * 100);
            
            // Save quiz results to localStorage
            userProgress.completeQuiz(percentage);
            
            quizContainer.innerHTML = `
                <div class="quiz-results">
                    <div class="results-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h3>Kết quả Quiz ${currentQuiz + 1}/${totalQuizzes}</h3>
                    <div class="score-display">
                        <span class="score-number">${score}/${currentQuizQuestions.length}</span>
                        <span class="score-percentage">${percentage}%</span>
                    </div>
                    <p class="score-message">
                        ${percentage >= 80 ? 'Xuất sắc! Bạn hiểu rất tốt về cảm xúc!' : 
                          percentage >= 60 ? 'Tốt! Hãy tiếp tục học hỏi thêm!' : 
                          'Hãy thử lại để cải thiện kết quả!'}
                    </p>
                    <div class="points-earned">
                        <i class="fas fa-star"></i>
                        <span>+${Math.round(percentage * 20)} điểm</span>
                    </div>
                    <div class="quiz-actions">
                        <button class="restart-quiz-btn" id="restartQuizBtn">Làm lại</button>
                        ${currentQuiz < totalQuizzes - 1 ? 
                            `<button class="next-quiz-btn" id="nextQuizBtn">Quiz tiếp theo</button>` : 
                            `<button class="complete-all-btn" id="completeAllBtn">Hoàn thành tất cả</button>`
                        }
                    </div>
                </div>
            `;
            
            // Add event listeners for buttons
            const restartBtn = document.getElementById('restartQuizBtn');
            if (restartBtn) {
                restartBtn.addEventListener('click', restartQuiz);
            }
            
            const nextQuizBtn = document.getElementById('nextQuizBtn');
            if (nextQuizBtn) {
                nextQuizBtn.addEventListener('click', nextQuiz);
            }
            
            const completeAllBtn = document.getElementById('completeAllBtn');
            if (completeAllBtn) {
                completeAllBtn.addEventListener('click', completeAllQuizzes);
            }
        }

function nextQuiz() {
    currentQuiz++;
    currentQuestion = 0;
    score = 0;
    
    // Reset quiz container to original state
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div class="quiz-card active" id="quizCard">
            <div class="quiz-header">
                <button class="back-to-start-btn" id="backToStartBtn">
                    <i class="fas fa-arrow-left"></i>
                    Quay lại
                </button>
            </div>
            <div class="quiz-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <span class="progress-text" id="progressText">Quiz ${currentQuiz + 1}/5 - Câu 1/10</span>
            </div>
            
            <div class="quiz-question" id="quizQuestion">
                <h4>Đang tải câu hỏi...</h4>
            </div>
            
            <div class="quiz-options" id="quizOptions">
                <button class="quiz-option" data-answer="A">
                    <span class="option-letter">A</span>
                    <span class="option-text">Đang tải...</span>
                </button>
                <button class="quiz-option" data-answer="B">
                    <span class="option-letter">B</span>
                    <span class="option-text">Đang tải...</span>
                </button>
                <button class="quiz-option" data-answer="C">
                    <span class="option-letter">C</span>
                    <span class="option-text">Đang tải...</span>
                </button>
                <button class="quiz-option" data-answer="D">
                    <span class="option-letter">D</span>
                    <span class="option-text">Đang tải...</span>
                </button>
            </div>
            
            <div class="quiz-feedback" id="quizFeedback" style="display: none;">
                <div class="feedback-content">
                    <div class="feedback-icon">🎉</div>
                    <h4>Chính xác!</h4>
                    <p>Bạn đã hiểu rất tốt về cách xử lý cảm xúc. Hãy tiếp tục!</p>
                </div>
                <button class="next-question-btn" id="nextQuestionBtn">Câu tiếp theo</button>
            </div>
        </div>
    `;
    
    // Add back to start button event listener
    const backBtn = document.getElementById('backToStartBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const startSection = document.getElementById('quizStartSection');
            const quizContainer = document.getElementById('quizContainer');
            
            if (startSection && quizContainer) {
                startSection.style.display = 'block';
                quizContainer.style.display = 'none';
            }
        });
    }
    
    // Update quiz display and setup event listeners
    updateQuizDisplay();
    setupQuizEventListeners();
}

function completeAllQuizzes() {
    // Show completion message
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div class="quiz-completion">
            <div class="completion-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <h3>🎉 Chúc mừng!</h3>
            <p>Bạn đã hoàn thành tất cả ${totalQuizzes} quiz!</p>
            <p>Bạn đã đạt được huy hiệu <strong>Thầy Quiz</strong>!</p>
            <button class="restart-all-btn" id="restartAllBtn">Bắt đầu lại từ đầu</button>
        </div>
    `;
    
    const restartAllBtn = document.getElementById('restartAllBtn');
    if (restartAllBtn) {
        restartAllBtn.addEventListener('click', () => {
            currentQuiz = 0;
            currentQuestion = 0;
            score = 0;
            updateQuizDisplay();
            setupQuizEventListeners();
        });
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    
    // Reset quiz container to original state
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div class="quiz-card active" id="quizCard">
            <div class="quiz-header">
                <button class="back-to-start-btn" id="backToStartBtn">
                    <i class="fas fa-arrow-left"></i>
                    Quay lại
                </button>
            </div>
            <div class="quiz-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <span class="progress-text" id="progressText">Quiz 1/5 - Câu 1/10</span>
            </div>
            
            <div class="quiz-question" id="quizQuestion">
                <h4>Khi bạn cảm thấy buồn, bạn thường làm gì?</h4>
            </div>
            
            <div class="quiz-options" id="quizOptions">
                <button class="quiz-option" data-answer="A">
                    <span class="option-letter">A</span>
                    <span class="option-text">Khóc và chia sẻ với người thân</span>
                </button>
                <button class="quiz-option" data-answer="B">
                    <span class="option-letter">B</span>
                    <span class="option-text">Nghe nhạc buồn và ở một mình</span>
                </button>
                <button class="quiz-option" data-answer="C">
                    <span class="option-letter">C</span>
                    <span class="option-text">Tìm cách làm việc khác để quên đi</span>
                </button>
                <button class="quiz-option" data-answer="D">
                    <span class="option-letter">D</span>
                    <span class="option-text">Vẽ tranh hoặc viết nhật ký</span>
                </button>
            </div>
            
            <div class="quiz-feedback" id="quizFeedback" style="display: none;">
                <div class="feedback-content">
                    <div class="feedback-icon">🎉</div>
                    <h4>Chính xác!</h4>
                    <p>Bạn đã hiểu rất tốt về cách xử lý cảm xúc. Hãy tiếp tục!</p>
                </div>
                <button class="next-question-btn" id="nextQuestionBtn">Câu tiếp theo</button>
            </div>
        </div>
    `;
    
    // Add back to start button event listener
    const backBtn = document.getElementById('backToStartBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const startSection = document.getElementById('quizStartSection');
            const quizContainer = document.getElementById('quizContainer');
            
            if (startSection && quizContainer) {
                startSection.style.display = 'block';
                quizContainer.style.display = 'none';
            }
        });
    }
    
    // Re-initialize quiz
    updateQuizDisplay();
    setupQuizEventListeners();
}

// Story System
function initStories() {
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
        card.addEventListener('click', () => {
            const storyId = card.getAttribute('data-story');
            openStory(storyId);
        });
    });
}

        function openStory(storyId) {
            if (!storyId) {
                console.error('Story ID is required');
                return;
            }
            
            // Save story read to localStorage
            userProgress.readStory(storyId);
            
            const stories = {
                '1': {
                    title: 'Chú Gấu và Cảm xúc',
                    content: `
                        <div class="story-content-full">
                            <h3>Chú Gấu và Cảm xúc</h3>
                            <div class="story-text">
                                <p>Ngày xửa ngày xưa, có một chú gấu tên là Boo sống trong rừng xanh. Boo rất hay thay đổi cảm xúc - khi thì vui vẻ nhảy nhót, khi thì buồn bã ngồi một góc.</p>
                                
                                <p>Một ngày nọ, Boo cảm thấy rất tức giận vì không tìm được mật ong. Chú gấu đã đập phá tổ ong và làm tổn thương những chú ong nhỏ. Những chú ong bay đi hết, và Boo càng tức giận hơn.</p>
                                
                                <p>Bà gấu già thông thái đã dạy Boo: "Con ơi, cảm xúc là điều tự nhiên, nhưng con cần học cách quản lý chúng. Khi tức giận, hãy hít thở sâu và nghĩ về hậu quả trước khi hành động."</p>
                                
                                <p>Boo học được cách hít thở sâu, đếm từ 1 đến 10, và nghĩ về những điều tốt đẹp. Chú gấu cũng học cách chia sẻ cảm xúc với bạn bè thay vì giữ trong lòng.</p>
                                
                                <p>Một ngày khác, Boo cảm thấy buồn vì mất bạn. Thay vì khóc một mình, chú gấu đã tìm đến bà gấu già để chia sẻ. Bà gấu đã dạy Boo rằng: "Buồn là cảm xúc bình thường, nhưng con không nên để nó kéo dài quá lâu. Hãy tìm những hoạt động vui vẻ để làm."</p>
                                
                                <p>Boo bắt đầu vẽ tranh, chơi với bạn bè, và giúp đỡ những con vật khác trong rừng. Chú gấu nhận ra rằng khi giúp đỡ người khác, mình cũng cảm thấy vui vẻ hơn.</p>
                                
                                <p>Từ đó, Boo học được cách kiểm soát cảm xúc và trở thành một chú gấu tốt bụng, được mọi người yêu quý. Chú gấu cũng dạy lại những bài học này cho các bạn nhỏ khác trong rừng.</p>
                            </div>
                            <div class="story-moral">
                                <h4>Bài học:</h4>
                                <p>Cảm xúc là bình thường, nhưng chúng ta cần học cách quản lý chúng một cách tích cực. Hãy chia sẻ cảm xúc với người thân và tìm những hoạt động vui vẻ để làm khi buồn.</p>
                            </div>
                            <div class="story-reward">
                                <i class="fas fa-star"></i>
                                <span>+50 điểm</span>
                            </div>
                        </div>
                    `
                },
                '2': {
                    title: 'Bạn bè và Sự chia sẻ',
                    content: `
                        <div class="story-content-full">
                            <h3>Bạn bè và Sự chia sẻ</h3>
                            <div class="story-text">
                                <p>Minh và Lan là hai người bạn thân từ nhỏ. Họ luôn chơi cùng nhau, học cùng nhau, và chia sẻ mọi thứ với nhau.</p>
                                
                                <p>Một ngày, Lan cảm thấy rất buồn vì bị điểm kém trong bài kiểm tra toán. Lan sợ bố mẹ sẽ thất vọng và bạn bè sẽ cười chê. Cô bé đã khóc một mình trong phòng.</p>
                                
                                <p>Minh đến nhà Lan và thấy bạn đang buồn. Thay vì hỏi ngay, Minh đã ngồi bên cạnh Lan và hỏi: "Bạn có muốn chia sẻ với mình không? Mình sẽ lắng nghe."</p>
                                
                                <p>Lan đã kể cho Minh nghe về nỗi buồn của mình. Minh không chỉ lắng nghe mà còn động viên: "Điểm kém không có nghĩa là bạn kém thông minh. Có thể bạn chỉ cần học cách khác thôi. Mình sẽ giúp bạn học toán nhé!"</p>
                                
                                <p>Từ đó, Minh và Lan học cùng nhau mỗi ngày. Minh dạy Lan cách giải toán dễ hiểu hơn, và Lan cũng giúp Minh học tiếng Anh. Cả hai đều tiến bộ rất nhiều.</p>
                                
                                <p>Một lần khác, Minh cảm thấy lo lắng vì sắp thi học kỳ. Lan đã an ủi: "Bạn đã học rất chăm chỉ rồi, mình tin bạn sẽ làm tốt. Nếu bạn lo lắng, hãy hít thở sâu và nghĩ về những điều tích cực."</p>
                                
                                <p>Nhờ sự chia sẻ và hỗ trợ lẫn nhau, cả hai đã vượt qua nhiều khó khăn và trở nên thân thiết hơn. Họ học được rằng tình bạn thật sự là khi có thể chia sẻ cả niềm vui và nỗi buồn.</p>
                            </div>
                            <div class="story-moral">
                                <h4>Bài học:</h4>
                                <p>Chia sẻ cảm xúc với bạn bè không chỉ giúp chúng ta cảm thấy tốt hơn mà còn làm tình bạn thêm gắn bó. Hãy lắng nghe và hỗ trợ bạn bè khi họ cần.</p>
                            </div>
                            <div class="story-reward">
                                <i class="fas fa-star"></i>
                                <span>+50 điểm</span>
                            </div>
                        </div>
                    `
                },
                '3': {
                    title: 'Vượt qua Nỗi sợ',
                    content: `
                        <div class="story-content-full">
                            <h3>Vượt qua Nỗi sợ</h3>
                            <div class="story-text">
                                <p>Hoa là một cô bé rất sợ bóng tối. Mỗi khi trời tối, cô bé thường khóc và gọi mẹ. Hoa sợ rằng trong bóng tối có những con quái vật đang ẩn nấp.</p>
                                
                                <p>Một ngày, mẹ đã dạy Hoa cách đối mặt với nỗi sợ: "Con ơi, sợ hãi là cảm xúc bình thường. Nhưng thay vì trốn tránh, con hãy thử hiểu nỗi sợ của mình. Bóng tối không có gì đáng sợ cả, nó chỉ là không có ánh sáng thôi."</p>
                                
                                <p>Mẹ đã dạy Hoa cách thở sâu và đếm từ 1 đến 10 khi cảm thấy sợ. Mẹ cũng dạy Hoa tưởng tượng về những điều tích cực, như những ngôi sao lấp lánh trên bầu trời đêm.</p>
                                
                                <p>Hoa bắt đầu thử ngủ một mình với đèn ngủ nhỏ. Cô bé học cách thở sâu và nghĩ về những điều vui vẻ. Dần dần, Hoa nhận ra rằng bóng tối không đáng sợ như cô bé nghĩ.</p>
                                
                                <p>Một đêm, Hoa nghe thấy tiếng động trong phòng. Thay vì sợ hãi, cô bé đã thở sâu và kiểm tra xem đó là gì. Hóa ra đó chỉ là tiếng gió thổi qua cửa sổ. Hoa cảm thấy rất tự hào vì đã vượt qua nỗi sợ.</p>
                                
                                <p>Từ đó, Hoa không còn sợ bóng tối nữa. Cô bé thậm chí còn thích ngắm sao vào ban đêm. Hoa học được rằng khi chúng ta đối mặt với nỗi sợ, chúng ta sẽ trở nên mạnh mẽ hơn.</p>
                                
                                <p>Hoa cũng dạy lại những bài học này cho em trai của mình khi em cũng sợ bóng tối. Cô bé trở thành một người chị gái dũng cảm và tự tin.</p>
                            </div>
                            <div class="story-moral">
                                <h4>Bài học:</h4>
                                <p>Chúng ta có thể học cách đối mặt và vượt qua những nỗi sợ hãi bằng cách hiểu và chấp nhận chúng. Hãy thở sâu và nghĩ về những điều tích cực khi cảm thấy sợ.</p>
                            </div>
                            <div class="story-reward">
                                <i class="fas fa-star"></i>
                                <span>+50 điểm</span>
                            </div>
                        </div>
                    `
                },
                '4': {
                    title: 'Làm việc nhóm',
                    content: `
                        <div class="story-content-full">
                            <h3>Làm việc nhóm</h3>
                            <div class="story-text">
                                <p>Minh, Lan và Hoa được cô giáo giao nhiệm vụ làm một dự án về môi trường. Ban đầu, cả ba đều muốn làm theo ý kiến của mình và không chịu lắng nghe nhau.</p>
                                
                                <p>Minh muốn làm poster về rừng, Lan muốn làm video về biển, còn Hoa muốn làm mô hình về thành phố xanh. Cả ba đều cãi nhau và không ai chịu nhường ai.</p>
                                
                                <p>Cô giáo đã dạy các bạn: "Làm việc nhóm không có nghĩa là ai cũng phải làm giống nhau. Mỗi người có thể đóng góp ý tưởng riêng, nhưng cần biết lắng nghe và hợp tác với nhau."</p>
                                
                                <p>Từ đó, ba bạn đã học cách chia sẻ ý tưởng và lắng nghe nhau. Minh vẽ poster rừng, Lan quay video biển, còn Hoa làm mô hình thành phố. Kết quả là một dự án hoàn chỉnh về môi trường.</p>
                                
                                <p>Khi trình bày trước lớp, cả ba đều tự hào về thành quả chung. Họ nhận ra rằng khi hợp tác, mọi việc sẽ dễ dàng và thú vị hơn nhiều.</p>
                                
                                <p>Từ đó, ba bạn trở thành nhóm bạn thân và thường xuyên làm việc cùng nhau. Họ học được rằng tình bạn và sự hợp tác là chìa khóa của thành công.</p>
                            </div>
                            <div class="story-moral">
                                <h4>Bài học:</h4>
                                <p>Làm việc nhóm giúp chúng ta học hỏi từ nhau và đạt được kết quả tốt hơn. Hãy lắng nghe, chia sẻ và hợp tác với bạn bè.</p>
                            </div>
                            <div class="story-reward">
                                <i class="fas fa-star"></i>
                                <span>+50 điểm</span>
                            </div>
                        </div>
                    `
                },
                '5': {
                    title: 'Sáng tạo và Tưởng tượng',
                    content: `
                        <div class="story-content-full">
                            <h3>Sáng tạo và Tưởng tượng</h3>
                            <div class="story-text">
                                <p>Nam là một cậu bé rất thích vẽ và tưởng tượng. Cậu thường vẽ những con vật kỳ lạ và những thành phố trong mơ. Nhưng một số bạn bè cười chê và nói rằng những gì Nam vẽ không có thật.</p>
                                
                                <p>Nam cảm thấy buồn và bắt đầu vẽ theo những gì người khác muốn. Cậu vẽ những bức tranh đơn giản và nhàm chán, không còn sáng tạo nữa.</p>
                                
                                <p>Cô giáo mỹ thuật đã khuyến khích Nam: "Sáng tạo là điều tuyệt vời nhất mà con người có. Đừng để ai đó làm mất đi trí tưởng tượng của em. Hãy vẽ những gì em muốn, những gì em mơ ước."</p>
                                
                                <p>Nam bắt đầu vẽ lại những gì cậu thích. Cậu vẽ những con rồng bay lượn, những thành phố dưới nước, và những hành tinh xa xôi. Mỗi bức tranh đều chứa đựng những câu chuyện thú vị.</p>
                                
                                <p>Dần dần, các bạn bè cũng bắt đầu thích thú với những bức tranh của Nam. Họ xin Nam dạy cách vẽ và cùng nhau tạo ra những tác phẩm tuyệt đẹp.</p>
                                
                                <p>Nam học được rằng sáng tạo và trí tưởng tượng là món quà quý giá. Khi chúng ta dám mơ ước và sáng tạo, chúng ta có thể tạo ra những điều kỳ diệu.</p>
                            </div>
                            <div class="story-moral">
                                <h4>Bài học:</h4>
                                <p>Sáng tạo và trí tưởng tượng giúp chúng ta phát triển tài năng và tạo ra những điều tuyệt vời. Hãy dám mơ ước và sáng tạo theo cách riêng của mình.</p>
                            </div>
                            <div class="story-reward">
                                <i class="fas fa-star"></i>
                                <span>+50 điểm</span>
                            </div>
                        </div>
                    `
                },
                '6': {
                    title: 'Trách nhiệm và Tự lập',
                    content: `
                        <div class="story-content-full">
                            <h3>Trách nhiệm và Tự lập</h3>
                            <div class="story-text">
                                <p>Minh là một cậu bé 8 tuổi, luôn được bố mẹ chăm sóc từng li từng tí. Cậu không biết tự mặc quần áo, không biết dọn dẹp phòng, và luôn nhờ người khác giúp đỡ.</p>
                                
                                <p>Một ngày, bố mẹ Minh phải đi công tác xa và để Minh ở nhà với bà ngoại. Bà ngoại đã dạy Minh: "Con đã lớn rồi, cần học cách tự chăm sóc bản thân. Đây là trách nhiệm của con."</p>
                                
                                <p>Minh bắt đầu học cách tự mặc quần áo, tự dọn dẹp phòng, và tự chuẩn bị đồ dùng học tập. Ban đầu rất khó khăn, nhưng dần dần cậu đã quen.</p>
                                
                                <p>Khi bố mẹ trở về, họ rất ngạc nhiên khi thấy Minh đã biết tự lập. Cậu tự dọn dẹp phòng, tự chuẩn bị đồ đi học, và thậm chí còn giúp bố mẹ làm việc nhà.</p>
                                
                                <p>Minh cảm thấy rất tự hào về bản thân. Cậu nhận ra rằng khi tự lập, mình sẽ mạnh mẽ và tự tin hơn. Cậu cũng hiểu rằng có trách nhiệm với bản thân là điều quan trọng.</p>
                                
                                <p>Từ đó, Minh luôn cố gắng tự làm những việc trong khả năng của mình. Cậu trở thành một cậu bé tự lập và có trách nhiệm, được mọi người yêu quý.</p>
                            </div>
                            <div class="story-moral">
                                <h4>Bài học:</h4>
                                <p>Tự lập và có trách nhiệm giúp chúng ta trở nên mạnh mẽ và tự tin. Hãy học cách tự chăm sóc bản thân và có trách nhiệm với những việc mình làm.</p>
                            </div>
                            <div class="story-reward">
                                <i class="fas fa-star"></i>
                                <span>+50 điểm</span>
                            </div>
                        </div>
                    `
                }
            };

            const story = stories[storyId];
            if (story) {
                showStoryModal(story.title, story.content);
            } else {
                console.error(`Story with ID ${storyId} not found`);
                alert('Câu chuyện không tìm thấy. Vui lòng thử lại!');
            }
        }

function showStoryModal(title, content) {
    if (!title || !content) {
        console.error('Title and content are required for story modal');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'story-modal-overlay';
    modal.innerHTML = `
        <div class="story-modal">
            <div class="story-modal-header">
                <h3>${title}</h3>
                <button class="close-story-btn">&times;</button>
            </div>
            <div class="story-modal-body">
                ${content}
            </div>
            <div class="story-modal-footer">
                <button class="close-story-btn">Đóng</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelectorAll('.close-story-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Kham Pha page...');
    
    // Load real data from localStorage
    userProgress.updateUI();
    
    // Initialize interactive features
    initStories();
    initQuizStart();
    
    console.log('Kham Pha page initialized successfully!');
});

// Initialize quiz start functionality
function initQuizStart() {
    const startBtn = document.getElementById('startQuizBtn');
    const startSection = document.getElementById('quizStartSection');
    const quizContainer = document.getElementById('quizContainer');
    
    if (startBtn && startSection && quizContainer) {
        startBtn.addEventListener('click', () => {
            // Hide start section
            startSection.style.display = 'none';
            
            // Show quiz container
            quizContainer.style.display = 'block';
            
            // Initialize quiz
            initQuiz();
        });
    }
}

// Scroll Animation System
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
        this.init();
    }
    
    init() {
        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .bounce-in, .rotate-in, .flip-in-x, .flip-in-y, .zoom-in, .slide-up, .slide-down, .elastic-in, .wiggle-in, .bounce-jump, .wiggle-bounce, .hop-skip, .spring-bounce');
        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
        
        // Add smooth scroll to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger effect for child elements
                const staggerElements = entry.target.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5');
                staggerElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, index * 100);
                });
                
                // Stop observing this element
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Interactive Effects System
class InteractiveEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Add hover effects to buttons
        this.addButtonEffects();
        
        // Add click effects
        this.addClickEffects();
        
        // Add typing effect to hero title
        this.addTypingEffect();
        
        // Add parallax scrolling
        this.addParallaxEffect();
    }
    
    addButtonEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('button, .btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    addClickEffects() {
        // Add shake effect on wrong answers
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('quiz-option') && e.target.classList.contains('wrong')) {
                e.target.classList.add('shake');
                setTimeout(() => {
                    e.target.classList.remove('shake');
                }, 500);
            }
        });
    }
    
    addTypingEffect() {
        // Typing effect disabled for page title as requested
        // Only apply to other elements if needed
    }
    
    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.float');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Initialize scroll animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    new ScrollAnimations();
    new InteractiveEffects();
});