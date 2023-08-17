// WEB Sitelerinden veri çekmemize veya otomasyon işlemleri yapmamıza yardımcı olan kütüphanemizi yüklüyoruz.
const puppeteer = require("puppeteer")

/* 
Gerçek zamanlı işlemler yapılacağından asekron bir fonksiyon tanımladık.
Hedef WEB Sitenin adresini parametre alıyoruz.
*/

const getReviews = async (url) => {

    // browser yüklüyoruz
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });


    // browserda yeni pencere açıyoruz.
    const page = await browser.newPage();


    // hedef adrese ilerliyoruz.
    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });


    /* 
    hedef adreste açılışta ilk 5 yorum gözüküyor bizim daha fazla yoruma ihtiyacımız olduğundan; 
    sayfada bulunan daha fazla yorum göster butonuna 10 kere tıklıyoruz
    ve böyleciklikle sayfada daha fazla yorum içeren elementler olacak
    gerçek zamanlı bir işlem olduğundan döngü sırasında her bir turda 4 saniye beklitiyoruz.
    */
    for (let i = 0; i < 10; i++) {

        await page.click(".fSXkBc")
        await page.waitForTimeout(4000);

    }

    /* 
    Geldik veri çekmeye :)
    sayfayı bir nesne olarak değil bir documan oalrak algılamak için evualte fonskiyonu çağırıyoruz.
    hedef içeirkleri sınıf değerlerine göre belirleyip bunların içerilerine girip içerdikleri metin değerini alıyoruz. 
    ve değeri liste olarak geri döndürüyoruz.
    */
    const response = await page.evaluate(() => {

        /* 
        her bir yorum li etiketi içerinde yorum yazar puan vb şekilde tutuluyor
        kapsayıcı etiketi bulup diğer etiketleri bunların içerindeki index değerine göre buluyorum.
        */
        const targetElements = document.querySelectorAll(".TR8uT-sM5MNb")

        const authorElements = document.querySelectorAll(".opMFSd-KVuj8d-V1ur5d")
        const commentElements = document.querySelectorAll(".i3PYUe-jNm5if");

        return Array.from(targetElements).map((targetElement, index) => {

            const author = authorElements[index].innerText
            const comment = commentElements[index].innerText;
            return { author, comment };

        });
    });

    // veriyi terminale çıktı olarak veriyoruz. isterseniz başka bir şey de yapabilirsiniz :)
    console.log(response)

    // işlem bittikten sonra açılan browserı kapatıyoruz.
    await browser.close();
};


// hedef urlyi veriyoruz ve fonksiyonu çalıştırıyoruz.
const target_url = "https://customerreviews.google.com/v/merchant?q=nerminhanim.com&c=TR&v=19"
getReviews(target_url)