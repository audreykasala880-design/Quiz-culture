// Script pour améliorer l'interactivité et l'accessibilité
document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('.category');

    categories.forEach(category => {
        // Gestion des événements clavier pour l'accessibilité
        category.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const href = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                window.location.href = href;
            }
        });

        // Animation au clic
        category.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Animation d'entrée progressive pour les catégories
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    categories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(category);
    });

    // Dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // Charger et afficher les scores depuis localStorage
    function loadScores() {
        const scoreboardRows = document.querySelectorAll('.scoreboard tbody tr');
        scoreboardRows.forEach(row => {
            const categoryCell = row.querySelector('td:first-child');
            const scoreCell = row.querySelector('td:nth-child(2)');
            if (categoryCell && scoreCell) {
                const category = categoryCell.textContent.trim();
                const score = localStorage.getItem(`score_${category}`) || '0';
                scoreCell.textContent = score;
            }
        });
    }

    // Appeler loadScores au chargement de la page
    loadScores();
});
