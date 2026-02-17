<template>
  <div id="app">
    <h1>🙏 구역 식구들의 축하 마음</h1>

    <div class="input-form">
      <input v-model="newItem.writer" placeholder="이름" />
      <input
        v-model="newItem.content"
        @keyup.enter="sendMessage"
        placeholder="축하 메시지 (엔터!)"
      />
      <button @click="sendMessage">보내기</button>
    </div>

    <div class="bubble-container">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="bubble"
        :style="getRandomStyle(index)"
      >
        <strong>{{ msg.WRITER }}</strong>
        <p>{{ msg.CONTENT }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      messages: [],
      newItem: { writer: "", content: "" },
      apiUrl: "https://yulha.duckdns.org/api/messages", // 백엔드 주소로 변경
    };
  },
  methods: {
    // 1. 메시지 불러오기
    async fetchMessages() {
      try {
        const res = await axios.get(this.apiUrl);
        // 데이터를 가져온 후 각각 랜덤 스타일 부여
        this.messages = res.data.map((m) => ({
          ...m,
          style: this.getRandomStyle(),
        }));
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      }
    },
    // 2. 메시지 보내기
    async sendMessage() {
      if (!this.newItem.writer || !this.newItem.content) return;
      await axios.post(this.apiUrl, {
        writer: this.newItem.writer,
        content: this.newItem.content,
      });
      this.newItem.content = ""; // 입력창 비우기
      this.fetchMessages(); // 목록 갱신
    },
    // 3. 랜덤 위치 및 색상 생성
    getRandomStyle(index) {
      // 1. 화면을 가로 4칸, 세로 4칸 정도의 격자로 생각합니다.
      const columns = 4;
      const row = Math.floor(index / columns);
      const col = index % columns;

      // 2. 각 격자 안에서 약간의 랜덤값(±5%)을 주어 자연스럽게 배치합니다.
      const top = row * 20 + 10 + Math.random() * 5;
      const left = col * 22 + 5 + Math.random() * 5;

      const colors = ["#FFD1DC", "#CAF0F8", "#E2F0CB", "#FFEFD5", "#E6E6FA"];
      const color = colors[index % colors.length]; // 색상도 순차적으로 부여

      return {
        top: `${top}%`,
        left: `${left}%`,
        backgroundColor: color,
        zIndex: index, // 나중에 올라온 글이 위로 오도록
      };
    },
  },
  mounted() {
    this.fetchMessages();
  },
};
</script>

<style>
.bubble-container {
  position: relative;
  width: 100%;
  height: 80vh; /* 풍선이 놀 수 있는 공간 */
  overflow: hidden;
  background-color: #f9f9f9;
}

.bubble {
  position: absolute;
  padding: 15px 20px;
  border-radius: 20px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 200px;
  cursor: pointer;
  transition: all 0.3s ease; /* 부드러운 전환 */
  z-index: 1;
}

/* 마우스를 올렸을 때의 효과 */
.bubble:hover {
  transform: scale(1.15) translateY(-5px); /* 크기 키우기 */
  z-index: 100 !important; /* 무조건 맨 앞으로 */
  box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.2);
  filter: brightness(1.05); /* 살짝 밝게 */
}

/* 둥실둥실 떠다니는 효과 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.input-form {
  margin-bottom: 20px;
  text-align: center;
}
</style>
