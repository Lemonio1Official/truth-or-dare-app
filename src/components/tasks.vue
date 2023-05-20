<script lang="ts">
import Title from "./help/title.vue";

type task = {
  task: string;
  type: boolean;
  for: "male" | "female" | "all";
};

interface data {
  s: any;
  parsed: boolean;
  form: {
    task: string;
    type: boolean;
    for: "male" | "female" | "all";
  };
  tasks: task[];
  editTask: number | null;
  deleteTask: number | null;
}

export default {
  name: "tasks",
  components: { Title },
  data(): data {
    return {
      s: this.$style,
      parsed: false,
      form: {
        task: "",
        type: true,
        for: "male",
      },
      tasks: [],
      editTask: null,
      deleteTask: null,
    };
  },
  methods: {
    parse() {
      if (this.parsed) return;
      this.parsed = true;
      const localTasks = localStorage.getItem("tasks");
      this.tasks = localTasks ? JSON.parse(localTasks) : [];
    },
    addTask() {
      const task = {
        task: this.form.task,
        type: this.form.type,
        for: this.form.for,
      };
      if (!this.form.task) {
        alert("Введіть завдання");
        return;
      }
      this.tasks.push(task);
      this.form.task = "";
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    EditTask() {
      this.tasks = this.tasks.map((i, ind) => {
        if (ind !== this.editTask) return i;
        i.task = this.form.task;
        i.type = this.form.type;
        i.for = this.form.for;
        return i;
      });
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      this.form.task = "";
      this.form.type = true;
      this.form.for = "male";
      this.editTask = null;
    },
  },
  watch: {
    deleteTask(id) {
      if (this.deleteTask === null) return;
      const confirmation = confirm("Ви впевнені ?");
      if (!confirmation) {
        this.deleteTask = null;
        return;
      }
      this.tasks = this.tasks.filter((_, i) => id !== i);
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      this.deleteTask = null;
    },
    editTask() {
      if (this.editTask === null) return;
      this.form.task = this.tasks[this.editTask].task;
      this.form.type = this.tasks[this.editTask].type;
      this.form.for = this.tasks[this.editTask].for;
    },
  },
};
</script>
<template>
  {{ parse() }}
  <div :class="s.tasks">
    <Title name="Завдання" />
    <div :class="s.content">
      <form :class="s.addTask">
        <label :class="s.inp">Завдання<input type="text" v-model="form.task" /></label>
        <span :class="s.gender">
          <label><input type="checkbox" @change="form.type = true" :checked="form.type" />Правда</label>
          <label><input type="checkbox" @change="form.type = false" :checked="!form.type" />Дія</label>
        </span>
        <div :class="s.labelInp">Для</div>
        <span :class="s.gender">
          <label><input type="checkbox" @change="form.for = 'male'" :checked="form.for === 'male'" />Чоловік</label>
          <label><input type="checkbox" @change="form.for = 'female'" :checked="form.for === 'female'" />Жінка</label>
          <label><input type="checkbox" @change="form.for = 'all'" :checked="form.for === 'all'" />Всі</label>
        </span>
        <button @click.prevent="editTask === null ? addTask() : EditTask()">{{ editTask === null ? "Додати" : "Зберегти" }}</button>
      </form>
      <div :class="s.tasksList">
        <span :class="s.empty" v-if="tasks.length === 0">Пусто</span>
        <ul v-else>
          <li v-for="(i, ind) of tasks" :key="ind">
            <s
              ><i
                :class="`fa-solid fa-${i.for === 'male' ? 'mars' : i.for === 'female' ? 'venus ' + s.g : 'venus-mars ' + s.a}`"
              /><span>{{ i.task }}</span></s
            >
            <span :class="s.actions"
              ><i class="fa-solid fa-pen" @click="editTask = ind" /><i class="fa-solid fa-trash" @click="deleteTask = ind"
            /></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
.tasks {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 24px 0 64px;
    .addTask {
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
      .labelInp {
        width: 95%;
        text-align: center;
        margin-top: 4px;
        font-size: 18px;
        font-weight: bold;
      }
      .gender {
        margin-top: 4px;
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
    .tasksList {
      display: flex;
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
          min-height: 70px;
          padding: 8px;
          background: rgba(52, 133, 255, 0.1);
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:last-child {
            padding-bottom: 16px;
          }
          s {
            text-decoration: none;
            width: calc(100% - 92px);
            display: flex;
            align-items: center;
            span {
              width: 100%;
              word-wrap: break-word;
              max-height: 54px;
              overflow-y: auto;
              &::-webkit-scrollbar {
                width: 2px;
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
              margin-right: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: rgb(52, 133, 255);
              &.g {
                color: rgb(255, 103, 149);
              }
              &.a {
                color: rgb(126, 255, 67);
              }
            }
          }
          .actions {
            width: 80px;
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
  }
}
</style>
