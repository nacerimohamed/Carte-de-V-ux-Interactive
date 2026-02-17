(function() {
    // Génération des particules
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const nbParticles = 20;
        for (let i = 0; i < nbParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = 1 + Math.random() * 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = 10 + Math.random() * 25 + 's';
            particle.style.opacity = 0.1 + Math.random() * 0.4;
            particlesContainer.appendChild(particle);
        }
    }

    // Génération des étoiles filantes
    const starsContainer = document.getElementById('shooting-stars-container');
    if (starsContainer) {
        const nbEtoilesFilantes = 5;
        for (let i = 0; i < nbEtoilesFilantes; i++) {
            const star = document.createElement('div');
            star.classList.add('shooting-star');
            star.style.top = Math.random() * 30 + '%';
            star.style.left = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 10 + 's';
            star.style.animationDuration = 3 + Math.random() * 4 + 's';
            starsContainer.appendChild(star);
        }
    }

    // Création des sons pour chaque ambiance (Web Audio API)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function jouerSon(ambiance) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(ambiance) {
            case 'priere':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
                break;
            case 'reussite':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                break;
            case 'tendresse':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
                break;
        }
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);
    }

    // Gestion des ambiances
    const carteVoeux = document.getElementById('carteVoeux');
    const ambiancePriere = document.getElementById('ambiancePriere');
    const ambianceReussite = document.getElementById('ambianceReussite');
    const ambianceTendresse = document.getElementById('ambianceTendresse');
    
    function updateAmbiance() {
        carteVoeux.classList.remove('ambiance-priere', 'ambiance-reussite', 'ambiance-tendresse');
        
        if (ambiancePriere.checked) {
            carteVoeux.classList.add('ambiance-priere');
            jouerSon('priere');
        } else if (ambianceReussite.checked) {
            carteVoeux.classList.add('ambiance-reussite');
            jouerSon('reussite');
        } else if (ambianceTendresse.checked) {
            carteVoeux.classList.add('ambiance-tendresse');
            jouerSon('tendresse');
        }
    }

    updateAmbiance();

    ambiancePriere.addEventListener('change', updateAmbiance);
    ambianceReussite.addEventListener('change', updateAmbiance);
    ambianceTendresse.addEventListener('change', updateAmbiance);

    // Compteur de caractères
    const messageArea = document.getElementById('messageVoeu');
    const compteurSpan = document.getElementById('compteur');

    if (messageArea && compteurSpan) {
        function updateCompteur() {
            const longueur = messageArea.value.length;
            compteurSpan.textContent = longueur + ' / 200';
            
            compteurSpan.classList.remove('proche-limite', 'limite-atteinte');
            if (longueur >= 180 && longueur < 200) {
                compteurSpan.classList.add('proche-limite');
            } else if (longueur >= 200) {
                compteurSpan.classList.add('limite-atteinte');
            }
        }
        messageArea.addEventListener('input', updateCompteur);
        updateCompteur();
    }

    // Fonction pour lancer les confettis
    function lancerConfettis() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffd966', '#bcaaff', '#ffa5d2', '#a68eff', '#ffb347']
        });

        setTimeout(() => {
            confetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.5 },
                colors: ['#e0c9ff', '#b1e5ff', '#ffc0e0']
            });
        }, 250);

        setTimeout(() => {
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.5 },
                colors: ['#ffe599', '#d4b5ff', '#ffb5a0']
            });
        }, 400);

        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5, x: 0.5 },
                startVelocity: 25,
                colors: ['#ffd966', '#bcaaff', '#ffa5d2', '#a68eff', '#ffb347', '#b5ffd5']
            });
        }, 600);
    }

    // Gestion de l'envoi du formulaire
    const form = document.getElementById('formVoeux');
    const messageSucces = document.getElementById('messageSucces');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const emetteur = document.getElementById('nomEmetteur').value.trim();
        const destinataire = document.getElementById('nomDestinataire').value.trim();
        const message = messageArea.value.trim();

        if (!emetteur || !destinataire || !message) {
            alert('✨ Merci de remplir tous les champs pour libérer ton vœu ✨');
            return;
        }

        lancerConfettis();
        messageSucces.classList.add('visible');

        setTimeout(() => {
            messageSucces.classList.remove('visible');
        }, 5000);
    });

    // Animation des champs au focus
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateX(5px) translateZ(10px)';
        });
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateX(0) translateZ(2px)';
        });
    });

    // Effet 3D qui suit la souris
    const carte = document.querySelector('.carte-voeux');
    
    carte.addEventListener('mousemove', (e) => {
        const rect = carte.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        if (!carte.matches(':hover')) return;
        
        carte.style.transform = `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(10px)
        `;
    });
    
    carte.addEventListener('mouseleave', () => {
        carte.style.transform = '';
    });
})();