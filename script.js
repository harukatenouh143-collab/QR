document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('qr-form');
    const usernameInput = document.getElementById('username');
    const canvasHolder = document.getElementById('canvas-holder');
    const urlDisplay = document.getElementById('url-display');
    const downloadBtn = document.getElementById('download-btn');
    const printBtn = document.getElementById('print-btn');

    // Generamos el QR a 350x350px para excelente resolución al imprimir
    const qrCode = new QRCodeStyling({
        width: 350,
        height: 350,
        type: 'canvas',
        data: '',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
        dotsOptions: {
            color: '#000000',
            type: 'rounded'
        },
        backgroundOptions: {
            color: '#ffffff'
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 6,
            imageSize: 0.26
        },
        cornersSquareOptions: {
            color: '#000000',
            type: 'extra-rounded'
        },
        cornersDotOptions: {
            color: '#000000',
            type: 'dot'
        }
    });

    function sanitizeInstagramUrl(input) {
        let clean = input.trim();

        if (clean.includes('instagram.com/')) {
            try {
                const parsedUrl = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
                const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
                if (pathSegments.length > 0) {
                    clean = pathSegments[0];
                }
            } catch (e) {
                clean = clean.split('?')[0].replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
            }
        }

        clean = clean.replace(/^@/, '');
        const finalUser = clean || 'gruposancayetano';

        return {
            username: finalUser,
            fullUrl: `https://www.instagram.com/${finalUser}`
        };
    }

    function updateQR(input) {
        const { username, fullUrl } = sanitizeInstagramUrl(input);

        qrCode.update({ data: fullUrl });
        canvasHolder.innerHTML = '';
        qrCode.append(canvasHolder);

        urlDisplay.textContent = `instagram.com/${username}`;
        return username;
    }

    // Inicialización al cargar la página
    let currentUsername = updateQR(usernameInput.value);

    // Eventos
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        currentUsername = updateQR(usernameInput.value);
    });

    downloadBtn.addEventListener('click', () => {
        qrCode.download({
            name: `qr-instagram-${currentUsername}`,
            extension: 'png'
        });
    });

    // Acción para imprimir
    printBtn.addEventListener('click', () => {
        window.print();
    });
});