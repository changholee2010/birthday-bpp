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
        :style="msg.style"
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
      apiUrl: "https://yulha.duckdns.org:3000/api/messages", // 백엔드 주소로 변경
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
    getRandomStyle() {
      const top = Math.floor(Math.random() * 70) + 10; // 10% ~ 80% 사이
      const left = Math.floor(Math.random() * 80) + 5; // 5% ~ 85% 사이
      const colors = ["#FFD1DC", "#CAF0F8", "#E2F0CB", "#FFEFD5", "#E6E6FA"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        top: `${top}%`,
        left: `${left}%`,
        backgroundColor: color,
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
  animation: float 3s ease-in-out infinite;
  transition: all 0.5s ease;
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
