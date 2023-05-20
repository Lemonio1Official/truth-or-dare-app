<script lang="ts">
import Title from "./help/title.vue";

type player = { name: string; gender: "male" | "female" };

interface data {
  s: any;
  parsed: boolean;
  form: {
    name: string;
    gender: "male" | "female";
  };
  players: player[];
  deletePlayer: number | null;
}

export default {
  name: "players",
  components: { Title },
  data(): data {
    return {
      s: this.$style,
      parsed: false,
      form: {
        name: "",
        gender: "male",
      },
      players: [],
      deletePlayer: null,
    };
  },
  methods: {
    parse() {
      if (this.parsed) return;
      this.parsed = true;
      const localPlayers = localStorage.getItem("players");
      this.players = localPlayers ? JSON.parse(localPlayers) : [];
    },
    addUser() {
      const player = {
        name: this.form.name,
        gender: this.form.gender,
      };
      if (!this.form.name) {
        alert("Введіть ім'я");
        return;
      }
      if (this.players.find((i) => JSON.stringify(i) === JSON.stringify(player))) {
        alert("Учасник вже існує");
        return;
      }
      this.players.push(player);
      this.form.name = "";
      localStorage.setItem("players", JSON.stringify(this.players));
    },
  },
  watch: {
    deletePlayer(id) {
      if (this.deletePlayer === null) return;
      this.players = this.players.filter((_, i) => id !== i);
      localStorage.setItem("players", JSON.stringify(this.players));
      this.deletePlayer = null;
    },
  },
};
</script>
<template>
  {{ parse() }}
  <div :class="s.players">
    <Title name="Учасники" />
    <div :class="s.content">
      <form :class="s.addPlayer">
        <label :class="s.inp">Ім'я<input type="text" v-model="form.name" /></label>
        <span :class="s.gender">
          <label><input type="checkbox" @change="form.gender = 'male'" :checked="form.gender === 'male'" />Чоловік</label>
          <label><input type="checkbox" @change="form.gender = 'female'" :checked="form.gender !== 'male'" />Жінка</label>
        </span>
        <button @click.prevent="addUser">Додати</button>
      </form>
      <div :class="s.playersList">
        <span :class="s.empty" v-if="players.length === 0">Пусто</span>
        <ul v-else>
          <li v-for="(i, ind) of players" :key="ind">
            <s
              ><span>{{ i.name }}</span
              ><i :class="`fa-solid fa-${i.gender === 'male' ? 'mars' : 'venus ' + s.g}`"
            /></s>
            <span :class="s.actions"><i class="fa-solid fa-trash" @click="deletePlayer = ind" /></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
.players {
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 24px 0 64px;
    .playersList {
      display: flex;
      width: 100%;
      background: #0002;
      padding: 12px 0;
      min-height: 60vh;
      .empty {
        text-align: center;
        width: 100%;
        height: max-content;
        font-size: 18px;
        color: rgba(255, 255, 255, 0.75);
      }
      ul {
        width: 100%;
        height: 60vh;
        overflow-y: auto;
        &::-webkit-scrollbar {
          background: #fff5;
          width: 4px;
        }
        &::-webkit-scrollbar-thumb {
          background: rgb(52, 133, 255);
        }
        li {
          padding: 8px;
          background: rgba(52, 133, 255, 0.1);
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          s {
            text-decoration: none;
            width: 124px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
              width: 100px;
              overflow-x: auto;
              white-space: nowrap;
              &::-webkit-scrollbar {
                height: 2px;
                background: #fff3;
              }
              &::-webkit-scrollbar-thumb {
                background: #222;
              }
            }
            i {
              width: 20px;
              height: 20px;
              font-size: 18px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: rgb(52, 133, 255);
              &.g {
                color: rgb(255, 103, 149);
              }
            }
          }
          .actions {
            width: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            i {
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(rgba(255, 181, 43, 0.8), rgba(255, 150, 52, 0.8));
              font-size: 18px;
              border-radius: 50%;
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .addPlayer {
      width: 100%;
      display: flex;
      padding: 12px 8px;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
      background: #0001;
      .inp {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 95%;
        input {
          width: 100%;
          background: #fff1;
          border-bottom: 2px solid rgb(52, 133, 255);
          padding: 4px;
          margin-top: 4px;
        }
      }
      .gender {
        margin-top: 8px;
        width: 95%;
        display: flex;
        justify-content: space-around;
        padding: 8px 0;
        label {
          display: flex;
          flex-direction: row;
          cursor: pointer;
          user-select: none;
          input {
            position: relative;
            margin-right: 8px;

            &::before {
              content: "";
              position: absolute;
              width: 16px;
              height: 16px;
              left: 50%;
              top: 50%;
              background: #666;
              border-radius: 2px;
              transform: translate(-50%, -50%);
            }
            &:checked::after {
              content: "";
              position: absolute;
              width: 8px;
              height: 8px;
              left: 50%;
              top: 50%;
              background: rgb(52, 133, 255);
              transform: translate(-50%, -50%);
            }
          }
        }
      }
      button {
        width: 95%;
        padding: 8px 0;
        margin-top: 12px;
        background: rgb(52, 133, 255);
        text-align: center;
        cursor: pointer;
        font-weight: 500;
      }
    }
  }
}
</style>
