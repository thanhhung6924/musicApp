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
const reloadbtn = $(".btn-repeat");
const bgr = $(".dashboard");
const bdr = $(".backdrop");

const app = {
  isRandom: false,
  currentIndex: 0,
  isPlaying: false,
  song: [
    {
      name: "Take me home",
      singer: "John denver",
      path: "./assets/music/(1)John_Denver_-_Take_Me_Home_Country_Roads_Remastered_(Hydr0.org).mp3",
      img: "./assets/img/bg1.webp",
    },
    {
      name: "Tinh Vệ",
      singer: "Nobody",
      path: "./assets/music/(8)TinhVeJapandeeRemix-HuaLamTamNhatKhoaLangTinh-10309354.mp3",
      img: "./assets/img/bg7.jpg",
    },
    {
      name: "Đánh đổi",
      singer: "Obito",
      path: "./assets/music/(3)Danh-Doi-Obito-MCk.mp3",
      img: "./assets/img/bh3.jpg",
    },
    {
      name: "Lemon Tree",
      singer: "Fools Garden",
      path: "./assets/music/(4)Lemon Tree - Fools Garden.mp3",
      img: "./assets/img/bg4jpg.jpg",
    },
    {
      name: "Nên chờ hay nên quên",
      singer: "Phan Duy Anh",
      path: "./assets/music/(5)NenChoHayNenQuenHuyNRemix-ChuThuyQuynh-11711602.mp3",
      img: "./assets/img/bg5.jpg",
    },
    {
      name: "Tam Giác",
      singer: "Unthehood",
      path: "./assets/music/(6)TamGiac-AnhPhanLowGLarriaVietNam-7131314.mp3",
      img: "./assets/img/anhphan.jpeg",
    },
    {
      name: "Thủ Đô Cypher",
      singer: "LowG-AnhPhan-MCK",
      path: "./assets/music/(2)Ha-Noi-Thu-7-Phai-Len-Do-Remix-RPT-Orijinn-LOW-G-RZMas-RPT-MCK-Thu-Do-Cypher.mp3",
      img: "./assets/img/bg2.jpg",
    },

    {
      name: "Phải Chia Tay Thôi",
      singer: "Nobody",
      path: "./assets/music/(7)PhaiChiaTayThoiDaiMeoRemix-HuongLy-7217233.mp3",
      img: "./assets/img/bg8.webp",
    },
    {
      name: "Anh rất nhớ em",
      singer: "Remix Trung Quốc",
      path: "./assets/music/(9)AnhRatNhoEmRemixTiktok2024-VA-13917196.mp3",
      img: "./assets/img/bg9.jpg",
    },
  ],
  render: function () {
    console.log("123"); //test rander
    const htmls = this.song.map((song, index) => {
      return ` 
             <div class="song ${
               index === this.currentIndex ? "active" : ""
             }"data-index=${index}>
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
    playlist.innerHTML = htmls.join("\n");
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

      ///câu lệnh này kiểm tra nêu bài hát hoàn thành thì next bài
      if (getProgress.value == 100) {
        // _this.nextSong();
        // getProgress.value = 0;

        // audio.play();
        // _this.render();
        if (_this.isRandom) {
          _this.randomSong();
        } else {
          _this.nextSong();
        }
        getProgress.value = 0;
        audio.play();
        _this.render();
        _this.scrollToactivesong();
      }
    };
    //xử lý tua nhạc
    getProgress.onchange = function (e) {
      //   console.log(e.target.value);
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    //khi next bài hát
    (nextbtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }

      audio.play();
      _this.render();
      _this.scrollToactivesong();
    }),
      (reloadbtn.onclick = function () {
        _this.prevSong();
        _this.nextSong();
        audio.play();
        // _this.render();
      });

    prevbtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }

      audio.play();
      _this.render();
      _this.scrollToactivesong();
    };
    randombtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      randombtn.classList.toggle("active", _this.isRandom);
    };
    //lắng nghe click lên playlist(bất cứ chỗ nào trên playlist)
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (
        songNode ||
        !e.target.closest(".option")
        //kick vào bài hat chưa acticve
        //closet trả về chính nó hoặc thẻ cha của nó nếu k phải thì trả về null
      ) {
        //xử lý khi ấn vào bài khác mới(đã làm)

        if (songNode) {
          //phải đổi sang number mới hoặc động
          _this.currentIndex = Number(songNode.getAttribute("data-index"));
          // _this.scrollToactivesong();
          _this.loadCurrentsong();
          audio.play();
          _this.render();
          console.log(songNode.getAttribute("data-index"));
        }
      }
      //xử lý khi ẩn vào option(chưa làm)
    };
  },
  //hàm này khi song active bị khuất thì đưa lên
  //kick hoat khi next và prev
  scrollToactivesong: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 700);
  },
  loadCurrentsong: function () {
    heading.textContent = this.currentSong.name;
     bgr.style.backgroundImage = `url(${this.currentSong.img})`;
     bdr .style.backdropFilter = "blur(10px)";
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
      this.currentIndex = this.song.length - 1;
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
