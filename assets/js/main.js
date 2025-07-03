// アコーディオン

document.addEventListener("DOMContentLoaded", function () {
  const questions = document.querySelectorAll(".qa-question");

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const qaItem = question.closest(".qa-item");

      if (answer.classList.contains("open")) {
        // フェードアウト（opacityだけ）
        answer.classList.remove("open");
        answer.classList.add("fadeout");

        // 0.5秒かけて文字が薄くなった後に display:none を適用
        setTimeout(() => {
          answer.style.display = "none";
          answer.classList.remove("fadeout");
        }, 200); // ← CSSの transition に合わせる
      } else {
        // 表示準備（display:block）
        answer.style.display = "block";

        // 一瞬待って opacity:1 に（transitionを効かせるため）
        setTimeout(() => {
          answer.classList.add("open");
        }, 10);
      }

      // ＋⇄− の切り替え
      qaItem.classList.toggle("active");
    });
  });
});

// ハンバーガー
document.addEventListener('DOMContentLoaded', () => {
  const btn       = document.querySelector('header .hamburger');
  const mobileNav = document.querySelector('header .nav-mobile');
  const navLinks  = document.querySelectorAll('header .nav-mobile .nav-list a');

  // ── 開く用タイムライン ──
  const tlOpen = gsap.timeline({ paused: true })
    .fromTo(mobileNav,
      { autoAlpha: 0, y: '-100%' },
      { autoAlpha: 1, y: '0%', duration: 0.5, ease: 'power2.out' }
    )
    .fromTo(navLinks,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' },
      '>'); // カード降下後にスタート

  // ── 閉じる用タイムライン ──
  const tlClose = gsap.timeline({ paused: true })
    // リンクとカードを同時にフェード＆スライドアップ
    .to([...navLinks, mobileNav],
      {
        autoAlpha: 0,
        y: i => (i < navLinks.length ? 30 : '-100%'),
        duration: 0.4,
        ease: 'power2.in'
      }, 0); // 0秒スタート

  btn.addEventListener('click', () => {
    const opening = btn.classList.toggle('is-open');
    if (opening) {
      // メニューを開く
      tlClose.pause(0);      // 閉じ用をリセット
      tlOpen.play(0);
      btn.setAttribute('aria-label', 'メニューを閉じる');
    } else {
      // メニューを閉じる
      tlOpen.pause(0);       // 開く用をリセット
      tlClose.play(0);
      btn.setAttribute('aria-label', 'メニューを開く');
    }
  });

  // リンククリックでも閉じる
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('is-open');
      tlOpen.pause(0);
      tlClose.play(0);
    });
  });
});

/* --------------------------------------------
   飛行パスの GSAP アニメーション
   -------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const path = document.querySelector('.flight-path path');
  if (!path) return;                       // 安全ガード

  // 破線パターン：実線12px + 空白10px = 22px
  const dashUnit = 22;
  gsap.set(path, {
    strokeDasharray: `12 ${dashUnit - 12}`, // 「12 10」と同義
    strokeDashoffset: 0
  });

  // 左→右へ空白が流れるように dashoffset をループ
  gsap.to(path, {
    strokeDashoffset: -dashUnit,
    duration: 0.7,           // 速さ（秒）
    ease: "none",
    repeat: -1               // 無限ループ
  });
});


// DOM が読み込まれたらアニメーションを開始
document.addEventListener("DOMContentLoaded", () => {
  // GSAP の無限 yoyo アニメーション
  gsap.to(".plane", {
    y: -10,              // 上下に動く距離（px）
    duration: 2,         // 1往復の所要時間（秒）
    ease: "sine.inOut",  // なめらかな往復イージング
    repeat: -1,          // 無限リピート
    yoyo: true           // 往復アニメーション
  });
});

// FLOW セクションのアイコンをスクロールでフェード＆スケールイン
  gsap.from(".flow .icon", {
    scrollTrigger: {
      trigger: ".flow",       // ここがビューに入ったら
      start: "top 80%",        // 上端がビューポートの 80% の位置に来たら
      toggleActions: "play none none none"
    },
    opacity: 0,               // 透明から
    y: 50,                    // 下から
    scale: 0.5,               // 小さく始まり
    duration: 1.5,            // 0.8秒で
    ease: "power2.out",       // なめらかに
    delay: 0.7,     // ← ここで 1 秒遅延
    stagger: 0.2              // アイコン同士を 0.2秒ずつズラして
  });


// WORKSのカード
gsap.from(".works .card", {
    scrollTrigger: {
      trigger: ".works .cards",  // WORKS 内のカードグループで発火
      start: "top 80%",
      toggleActions: "play none none none"
    },
    x: (i) => (i % 2 === 0 ? -100 : 100),  // 偶数番目は左から、奇数番目は右から
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.5  // ここを調整：0.4秒ずつ遅らせて順番にアニメーション
  });


// オーニングアニメーション

// assets/js/main.js

window.addEventListener("load", () => {
  // レスポンシブ時（768px 以下）は何もしないで即コンテンツ表示
  if (window.matchMedia("(max-width: 768px)").matches) {
    const loader  = document.getElementById("loader");
    const content = document.getElementById("content");

    if (loader) {
      loader.style.display = "none";
    }
    if (content) {
      content.style.visibility = "visible";
      content.style.opacity    = 1;
    }
    return; // ここで抜けるので以降の GSAP アニメーションは実行されません
  }

  // ── PC 用：オーニングアニメーション（従来のコード）──
  const tl = gsap.timeline({ defaults: { ease: "power1.out" } });

  // (1) 本体コンテンツと波紋サークルを隠す
  gsap.set("#content",       { autoAlpha: 0 });
  gsap.set("#loader-circle", { autoAlpha: 0, scale: 0, transformOrigin: "center center" });

  // (2) ロゴを画面外上部に隠しておく
  gsap.set("#loader-logo",   { y: -500, autoAlpha: 1 });

  tl
    // (3) ロゴを y:0 の“地面”まで落として、bounce.out で自然な減衰バウンス
    .to("#loader-logo", {
      y: 0, duration: 1.5, ease: "bounce.out"
    })

    // (4) ロゴをフェードアウト → ACHION テキスト
    .to("#loader-logo", { autoAlpha: 0, duration: 0.3 }, "+=0.2")
    .fromTo("#loader-text",
      { autoAlpha: 0, scale: 0.5 },
      { autoAlpha: 1, scale: 1, duration: 1, ease: "power2.out" }
    )

    // (5) 白い円を波紋のように拡大
    .to("#loader-circle", { autoAlpha: 1, duration: 0 }, "+=0.2")
    .to("#loader-circle", {
      scale: 100, duration: 1.2, ease: "power1.inOut"
    })

    // (6) ローダーをフェードアウト＆コンテンツ表示
    .to("#loader",  { autoAlpha: 0, duration: 0.3 }, "-=0.2")
    .to("#content", { autoAlpha: 1, duration: 0.5 });
});




// 点線を右→左にループアニメーション
gsap.to(".section-divider line", {
  strokeDashoffset: -22,  // dash(12px)+gap(10px)=22 → これだけずらす
  ease: "none",           // 等速
  duration: 2.5,           // 10秒で一周（お好みで調整）
  repeat: -1              // 無限ループ
});
