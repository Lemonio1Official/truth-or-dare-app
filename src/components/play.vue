<script lang="ts">
import Title from "./help/title.vue";

type player = { name: string; gender: "male" | "female" };
type task = {
  task: string;
  type: boolean;
  for: "male" | "female" | "all";
};

interface data {
  s: any;
  checked: boolean;
  players: player[];
  tasks: task[];
  currPlayer: number;
  currTask: string;
  currType: boolean | "random";
  allTasks: {
    menTruth: string[];
    menDare: string[];
    womenTruth: string[];
    womenDare: string[];
  };
  error: string;
}

export default {
  name: "play",
  components: { Title },
  data(): data {
    return {
      s: this.$style,
      checked: false,
      players: [],
      tasks: [],
      currPlayer: 0,
      currTask: "",
      currType: false,
      allTasks: {
        menTruth: [],
        menDare: [],
        womenTruth: [],
        womenDare: [],
      },
      error: "",
    };
  },
  methods: {
    parse() {
      const players = localStorage.getItem("players");
      const tasks = localStorage.getItem("tasks");
      const currPlayer = localStorage.getItem("currPlayer");
      this.players = players ? JSON.parse(players) : [];
      this.tasks = tasks ? JSON.parse(tasks) : [];
      this.currPlayer = currPlayer ? JSON.parse(currPlayer) : 0;
    },
    checker() {
      if (this.checked) return;
      this.checked = true;
      this.parse();
      if (this.players.length < 2) {
        this.error = "Недостатньо гравців";
        return;
      }
      if (this.players.find((i) => i.gender === "male")) {
        if (!this.tasks.find((i) => i.for === "male" || i.for === "all")) {
          this.error = "Завдань для чоловіків немає";
          return;
        }
        if (!this.tasks.find((i) => i.type && (i.for === "male" || i.for === "all")))
          this.error = 'Завдання "Правда" для чоловіків відсутнє';
        if (!this.tasks.find((i) => !i.type && (i.for === "male" || i.for === "all")))
          this.error = 'Завдання "Дія" для чоловіків відсутнє';
      }
      if (this.players.find((i) => i.gender === "female")) {
        if (!this.tasks.find((i) => i.for === "female" || i.for === "all")) {
          this.error = "Завдань для жінок немає";
          return;
        }
        if (!this.tasks.find((i) => i.type && (i.for === "female" || i.for === "all")))
          this.error = 'Завдання "Правда" для жінок відсутнє';
        if (!this.tasks.find((i) => !i.type && (i.for === "female" || i.for === "all")))
          this.error = 'Завдання "Дія" для жінок відсутнє';
      }
      if (!this.error) this.getTasks();
    },
    getTasks() {
      const [menTruth, menDare, womenTruth, womenDare]: string[][] = [[], [], [], []];
      this.tasks.map((i) => {
        if (i.for === "all") {
          if (i.type) {
            menTruth.push(i.task);
            womenTruth.push(i.task);
          } else {
            menDare.push(i.task);
            womenDare.push(i.task);
          }
          return;
        }
        if (i.for === "male") {
          if (i.type) menTruth.push(i.task);
          else menDare.push(i.task);
          return;
        }
        if (i.for === "female") {
          if (i.type) womenTruth.push(i.task);
          else womenDare.push(i.task);
        }
      });
      this.allTasks = {
        menTruth,
        menDare,
        womenTruth,
        womenDare,
      };
    },
    playHandler(type: boolean | "random" = false) {
      this.currType = type;
      if (type === "random") {
        const randomInt = Math.floor(Math.random() * 2);
        if (randomInt) type = true;
        else type = false;
      }
      if (this.players[this.currPlayer].gender === "male") {
        if (type) {
          const indTask = Math.floor(Math.random() * this.allTasks.menTruth.length);
          this.currTask = Processing(this.allTasks.menTruth[indTask], this.players, this.currPlayer);
        } else {
          const indTask = Math.floor(Math.random() * this.allTasks.menDare.length);
          this.currTask = Processing(this.allTasks.menDare[indTask], this.players, this.currPlayer);
        }
      } else {
        if (type) {
          const indTask = Math.floor(Math.random() * this.allTasks.womenTruth.length);
          this.currTask = Processing(this.allTasks.womenTruth[indTask], this.players, this.currPlayer);
        } else {
          const indTask = Math.floor(Math.random() * this.allTasks.womenDare.length);
          this.currTask = Processing(this.allTasks.womenDare[indTask], this.players, this.currPlayer);
        }
      }
      function Processing(task: string, players: player[], cPlayer: number) {
        if (task.indexOf("$boy") > -1) {
          const Players = players.filter((i) => i.gender === "male" && i.name !== players[cPlayer].name);
          const randInt = Math.floor(Math.random() * Players.length);
          const name = Players[randInt].name;
          task = task.replace(/\$boy/g, name);
        }
        if (task.indexOf("$girl") > -1) {
          const Players = players.filter((i) => i.gender === "female" && i.name !== players[cPlayer].name);
          const randInt = Math.floor(Math.random() * Players.length);
          const name = Players[randInt].name;
          task = task.replace(/\$girl/g, name);
        }
        return task;
      }
    },
    nextPlayer() {
      if (this.players.length - 1 === this.currPlayer) this.currPlayer = 0;
      else this.currPlayer++;
      localStorage.setItem("currPlayer", this.currPlayer.toString());
      this.currType = false;
      this.currTask = "";
    },
  },
  computed: {
    playerName() {
      if (!this.players[this.currPlayer]) {
        this.currPlayer = 0;
      }
      const name = this.players[this.currPlayer].name;
      return name.length > 16 ? name.slice(0, 16) + ".." : name;
    },
  },
};
</script>
<template>
  {{ checker() }}
  <div :class="s.play">
    <Title :name="'🔹 ' + (error ? '❌' : playerName) + ' 🔹'" />
    <div v-if="error" :class="s.errWrap">
      <span>{{ error }}</span>
    </div>
    <div v-else-if="!currTask" :class="s.choice">
      <button :class="s.t" @click="playHandler(true)">ПРАВДА</button>
      <button :class="s.r" @click="playHandler('random')">Рандом</button>
      <button :class="s.d" @click="playHandler()">Дія</button>
    </div>
    <div v-else :class="s.task">
      <span>{{ currTask }}</span>
      <div>
        <i class="fa-solid fa-rotate" @click="playHandler(currType)" /><i
          class="fa-solid fa-circle-chevron-right"
          @click="nextPlayer"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
.play {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  .errWrap {
    background: #0001;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 64px;
    span {
      width: 95%;
      text-align: center;
      padding: 4px;
      background: rgb(255, 46, 46);
      font-size: 20px;
      border-radius: 5px;
      box-shadow: 0 5px 4px -1px #0009;
    }
  }
  .choice {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 95%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    border-radius: 5px;
    button {
      width: 75%;
      background: linear-gradient(rgba(99, 198, 255, 0.067), #0004);
      padding: 12px 0;
      margin-bottom: 32px;
      border-radius: 5px;
      font-size: 20px;
      font-weight: 500;
      &:active {
        background: #0004;
      }
      &:last-child {
        margin-bottom: 0;
      }
      &.r {
        font-size: 18px;
        width: 50%;
        padding: 8px 0;
      }
      &.t {
        color: rgb(255, 82, 82);
      }
      &.d {
        color: rgb(126, 255, 67);
      }
    }
  }
  .task {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    span {
      width: 95%;
      font-size: 18px;
      padding: 8px;
      background: #0002;
      border-radius: 5px;
    }
    div {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      bottom: 20px;
      width: 75%;
      display: flex;
      justify-content: space-around;
      i {
        font-size: 40px;
        padding: 8px;
        background: rgb(52, 133, 255);
        border-radius: 50%;
        cursor: pointer;
        &:active {
          background: rgb(52, 133, 255, 0.8);
        }
      }
    }
  }
}
</style>
