//MathJax 3.x sürümünde yapılandırma biraz farklıdır. Aşağıdaki örneği kullanarak MathJax’i yapılandırabilirsin:
window.MathJax = {
    tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
    },
    svg: {
    fontCache: 'global'
    }
};

document.addEventListener('DOMContentLoaded', function() {

    const acreAmountInput = document.getElementById('acreAmount');
    const fenceCostInput = document.getElementById('fenceCost');
    const calculateButton = document.getElementById('calculateButton');

    const canvas = document.getElementById('fenceCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'images/model1.jpeg'; // Görüntü dosyasının yolu
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    //İpucu ekranı gösteriliyor
    const baslik="İPUCU";
    //Buraya ipucunu yazabilirsin
    const ipucu="Bu etkinlikte, 'Çit Maliyeti' hesaplaması yapacağız. Pencerenin sol yanında yer alan 'Arsa miktarı' ve 'Metre başına çit maliyeti' kısımlarına uygun verileri girdikten sonra 'Hesapla' butonuna basarak çözüm adımlarını gözlemleyebilirsiniz. Veri girmeden de 'Nasıl Çözülür' butonuna basarak çözüm yöntemini öğrenerek işlemleri kendiniz de yapabilirsiniz.";

    ipucuDiyalogAc(baslik,ipucu);

    function toggleCalculateButton() {
        if (acreAmountInput.value.trim() && fenceCostInput.value.trim()) {
            calculateButton.disabled = false;
        } else {
            calculateButton.disabled = true;
        }
    }

    acreAmountInput.addEventListener('input', toggleCalculateButton);
    fenceCostInput.addEventListener('input', toggleCalculateButton);

});

//Maksimum 5 basamaklı bir sayı girişine izin verilecek
document.getElementById('acreAmount').addEventListener('input', function (e) {
    if (this.value.length > 5) {
        this.value = this.value.slice(0, 5);
    }
});

//Maksimum 9 basamaklı bir sayı girişine izin verilecek
document.getElementById('fenceCost').addEventListener('input', function (e) {
    if (this.value.length > 9) {
        this.value = this.value.slice(0, 9);
    }
});

function calculateCost() {
    playClick();

    const acreAmount = parseFloat(document.getElementById('acreAmount').value);
    const fenceCost = parseFloat(document.getElementById('fenceCost').value);
    const perimeter = 4 * Math.sqrt(acreAmount * 1000); // 1 dönüm = 1000 m², kare şeklinde arsa varsayımı
    const totalCost = perimeter * fenceCost;

    drawFenceModel(acreAmount);
    showSolutionSteps(acreAmount, perimeter, fenceCost, totalCost);

    // solutionSteps için fade-in animasyonu ekleme
    fadeInSolutionSteps();

}

function fadeInSolutionSteps() {
    const solutionSteps = document.getElementById('solutionSteps');
    let opacity = 0;
    solutionSteps.style.opacity = opacity;
    solutionSteps.style.display = 'block'; // Görünürlüğü aç

    const fadeInterval = setInterval(function() {
        opacity += 0.05; // Opaklığı artır
        if (opacity >= 1) { // Opaklık 1 olunca animasyonu durdur
            clearInterval(fadeInterval);
        }
        solutionSteps.style.opacity = opacity;
    }, 50); // 50ms aralıklarla opacity artırılır
}

function showSolutionSteps(acreAmount, perimeter, fenceCost, totalCost) {

    // Mevcut MathJax içeriğini temizle
    $('#step1').empty();
    $('#step2').empty();
    $('#step3').empty();
    $('#step4').empty();

    $('#solutionSteps').show();

    // Dönüm bilgisi yazdırma
    var regularText=document.getElementById('acreAmount').value.replace('.', ',');

    $('#step1').html(`Arsa ${regularText} dönüm. 1 dönüm=1000 m²`);
    $('#step2').html(`Arsanın bir kenarının uzunluğu:$$ \\sqrt{${acreAmount * 1000}} \\approx ${Math.sqrt(acreAmount * 1000).toFixed(2).replace('.', ',')} \\text{ metre}$$`);
    $('#step3').html(`Arsanın çevresinin uzunluğu:$$4 \\times ${Math.sqrt(acreAmount * 1000).toFixed(2).replace('.', ',')} \\approx ${perimeter.toFixed(2).replace('.', ',')} \\text{ metre}$$`);
    $('#step4').html(`Toplam Çit Maliyeti:$$\\ ${perimeter.toFixed(2).replace('.', ',')} \\times ${fenceCost} = ${totalCost.toFixed(2).replace('.', ',')} \\text{ ₺}$$`);

    $('#step1').fadeIn(1000, function() {
        $('#step2').fadeIn(1000, function() {
            $('#step3').fadeIn(1000, function() {
                $('#step4').fadeIn(1000, function() {                 
                    
                });
            });
        });
    });

    MathJax.typeset();
}

function drawFenceModel(acreAmount) {
    const canvas = document.getElementById('fenceCanvas');
    const ctx = canvas.getContext('2d');
    const size = Math.sqrt(acreAmount * 1000); // Arsanın bir kenarının uzunluğu
    const scale = 5; // Ölçek faktörü

    const images = ['images/model1.jpeg', 'images/model2.jpeg', 'images/model3.jpeg', 'images/model4.jpeg'];
    const randomImage = images[Math.floor(Math.random() * images.length)];

    const img = new Image();
    img.src = randomImage;

    // Soluklaşma animasyonu
    function fadeOut(callback) {
        let opacity = 1;
        const fadeInterval = setInterval(function() {
            opacity -= 0.05;
            if (opacity <= 0) {
                clearInterval(fadeInterval);
                callback();
            }
            canvas.style.opacity = opacity;
        }, 50);
    }

    // Yeni resmi yüklerken canvas opaklığını geri getirme
    function fadeIn() {
        let opacity = 0;
        canvas.style.opacity = opacity;
        const fadeInterval = setInterval(function() {
            opacity += 0.05;
            if (opacity >= 1) {
                clearInterval(fadeInterval);
            }
            canvas.style.opacity = opacity;
        }, 50);
    }

    img.onload = function() {
        // Soluklaşma animasyonu başlamadan önce mevcut içeriği temizliyoruz
        fadeOut(function() {
             // İlk resmin boyutunu biraz daha büyük başlatmak için minimum boyut belirliyoruz
             let adjustedSize;
            if (acreAmount <= 5) {
                adjustedSize = 200;
            } else if (acreAmount<=65) {
                adjustedSize = 200 + (acreAmount - 5) * scale;
            } else {
                adjustedSize =  canvas.width;
            }

            // Yeni resmi ve çiti çizmeden önce canvas'ı ayarlama
            canvas.width = adjustedSize;
            canvas.height = adjustedSize;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Resmi canvas'ın merkezine yerleştirme ve tamamını gösterme
            const aspectRatio = img.width / img.height;
            let drawWidth, drawHeight;
            if (canvas.width / canvas.height > aspectRatio) {
                drawHeight = canvas.height;
                drawWidth = canvas.height * aspectRatio;
            } else {
                drawWidth = canvas.width;
                drawHeight = canvas.width / aspectRatio;
            }
            const x = (canvas.width - drawWidth) / 2;
            const y = (canvas.height - drawHeight) / 2;
            ctx.drawImage(img, x, y, drawWidth, drawHeight);

            // Çit çizimi
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 5;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // Dönüm bilgisi yazdırma
            var regularText=document.getElementById('acreAmount').value.replace('.', ',');
            
            document.getElementById('acreInfo').innerText = `${regularText} dönüm`;
            document.getElementById('acreInfo').style.fontSize = '18px';

            // Yeni resim yüklendikten sonra soluklaşarak görünür hale getirme
            fadeIn();
        });
    };
}

function playClick() {
    var sound = document.getElementById("click");
    sound.currentTime = 0; // Sesi baştan çal
    sound.play().catch(function(error) {
        console.log("Ses oynatılamadı: ", error);
    });
}

function ipucuDiyalogAc(baslik, ipucu) {

    // Dialog arkaplanını oluştur
    const overlay = document.createElement('div');
    overlay.className = 'dialog-ipucu-overlay';

    // Dialog kutusunu oluştur
    const dialogBox = document.createElement('div');
    dialogBox.className = 'dialog-ipucu-box';

    // Başlık ve resim konteynerini oluştur
    const titleContainer = document.createElement('div');
    titleContainer.className = 'dialog-ipucu-title-container';

    // Resmi oluştur
    const img = document.createElement('img');
    // Base64 kodunu buraya ekleyin
    img.src = "images/key.png";
    img.alt = 'İpucu Resmi';
    img.style.width = '50px'; // Gerekirse boyutu ayarlayın
    img.style.height = '50px'; // Gerekirse boyutu ayarlayın

    // Başlığı oluştur
    const title = document.createElement('div');
    title.className = 'dialog-ipucu-title';
    title.textContent = baslik;

    // İçeriği oluştur
    const content = document.createElement('div');
    content.className = 'dialog-ipucu-content';
    content.innerHTML = ipucu;

    // Butonları oluştur
    const buttons = document.createElement('div');
    buttons.className = 'dialog-ipucu-buttons';

    const closeButton = document.createElement('button');
    closeButton.className = 'close-ipucu-button';
    closeButton.textContent = 'Tamam';
    closeButton.addEventListener('click', function() {
        playClick();
        overlay.remove();
    });

    // Elemanları birleştir
    titleContainer.appendChild(img);
    titleContainer.appendChild(title);
    buttons.appendChild(closeButton);
    dialogBox.appendChild(titleContainer);
    dialogBox.appendChild(content);
    dialogBox.appendChild(buttons);
    overlay.appendChild(dialogBox);

    // Dialogu sayfaya ekle
    document.body.appendChild(overlay);
}

