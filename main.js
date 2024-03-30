const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player");
const playlist = $(".playlist");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const getProgress = $("#progress");
const nextbtn = $(".btn-next");
const prevbtn = $(".btn-prev");
const randombtn = $(".btn-random");

const app = {
  isRandom: false,
  currentIndex: 0,
  isPlaying: false,
  song: [
    {
      name: "take me home",
      singer: "john denver",
      path: "./assets/music/(1)John_Denver_-_Take_Me_Home_Country_Roads_Remastered_(Hydr0.org).mp3",
      img: "./assets/img/bg1.webp",
    },
    {
      name: "Thủ Đô Cypher",
      singer: "john denver",
      path: "./assets/music/(2)Ha-Noi-Thu-7-Phai-Len-Do-Remix-RPT-Orijinn-LOW-G-RZMas-RPT-MCK-Thu-Do-Cypher.mp3",
      img: "./assets/img/bg2.jpg",
    },
    {
      name: "Đánh đổi",
      singer: "john denver",
      path: "./assets/music/(3)Danh-Doi-Obito-MCk.mp3",
      img: "./assets/img/bh3.jpg",
    },
    {
      name: "Lemon Tree",
      singer: "john denver",
      path: "./assets/music/(4)Lemon Tree - Fools Garden.mp3",
      img: "./assets/img/bg4jpg.jpg",
    },
    {
      name: "Nên chờ hay nên quên",
      singer: "john denver",
      path: "./assets/music/(5)NenChoHayNenQuenHuyNRemix-ChuThuyQuynh-11711602.mp3",
      img: "./assets/img/bg5.jpg",
    },
    {
      name: "Tam Giác",
      singer: "john denver",
      path: "./assets/music/(6)TamGiac-AnhPhanLowGLarriaVietNam-7131314.mp3",
      img: "./assets/img/anhphan.jpeg",
    },
    {
      name: "Thủ Đô Cypher",
      singer: "john denver",
      path: "./assets/music/(2)Ha-Noi-Thu-7-Phai-Len-Do-Remix-RPT-Orijinn-LOW-G-RZMas-RPT-MCK-Thu-Do-Cypher.mp3",
      img: "./assets/img/bg2.jpg",
    },
  ],
  render: function () {
    console.log("123"); //test rander
    const htmls = this.song.map((song) => {
      return ` 
             <div class="song">
        <div class="thumb" style="background-image: url('${song.img}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`;
    });
    $(".playlist").innerHTML = htmls.join("\n");
  },
  //lấy bài nhạt hiện tại(định nghĩa )
  definePropertys: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.song[this.currentIndex];
      },
    });
  },

  handleEvent: function () {
    const _this = this;
    ///hàm này kiểm tra kéo chuột để thu to phóng nhỏ ảnh CD
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      // console.log(window.scrollY);
      const newcdWidth = cdWidth - window.scrollY;
      console.log(newcdWidth);
      //thay đổi kích thước cd

      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      cd.style.opacity = newcdWidth / cdWidth;
      //Xử lý cd quay và dừng
    };
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    //xử lý play khi click
    playBtn.addEventListener("click", function () {
      if (_this.isPlaying) {
        // _this.isPlaying = false;
        audio.pause();
        // player.classList.remove("playing");
      } else {
        // _this.isPlaying = true;
        audio.play();
        // player.classList.add("playing");
      }
    });
    //khi song dc play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    //khi song dc pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    //khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPersent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        ); //test
        getProgress.value = progressPersent;
      }
      if (getProgress.value == 100) {
        _this.nextSong();
       
        getProgress.value =0;
        audio.play();
      }
    };
    //xử lý tua nhạc
    getProgress.onchange = function (e) {
      //   console.log(e.target.value);
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    //khi next bài hát
    nextbtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }

      audio.play();
    };
    prevbtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }

      audio.play();
    };
    randombtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      randombtn.classList.toggle("active", _this.isRandom);
    };
  },
  loadCurrentsong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
    audio.src = this.currentSong.path;
    // console.log(heading, cdThumb, audio);
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.song.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentsong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.song.length;
    }
    this.loadCurrentsong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.song.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentsong();
  },
  start: function () {
    //định nghĩa các thuộc tính cho object
    this.definePropertys();
    //render các playlist
    this.render();
    //lắng nghe xử lý các sự kiện
    this.handleEvent();
    this.loadCurrentsong();
  },
};
app.start();
//render songs
//croll top
//play/pause/seek
//CD rotate
//next/prev
//random
//netx/repeat when ended
//active song
//scroll active song into view
//play song when clicked
/////////////////////////////
//render songs
