document.addEventListener("DOMContentLoaded", () => {

  const state = {
    turn: 1,
    maxTurns: 20,
    money: 1200,

    metrics: {
      happiness: 60,
      ecology: 55,
      mobility: 50,
      education: 45,
      health: 50,
      economy: 55
    },

    population: 120000,

    projects: {},

    news: [
      "Город просыпается. Жители ждут ваших решений.",
      "Акимат получил новый бюджет.",
      "Начинается первый рабочий месяц."
    ],

    started: false,
    eventOpen: false,
    gameOver: false,
    lastEvent: null
  };


  /* =========================
     ПРОЕКТЫ
     ========================= */

  const PROJECTS = {

    park: {
      name: "Городской парк",
      icon: "🌳",
      costs: [70, 45, 60],
      income: 2,
      effects: {
        ecology: 7,
        happiness: 6
      },
      position: [115, 330]
    },

    school: {
      name: "Школа",
      icon: "🏫",
      costs: [100, 65, 90],
      income: 1,
      effects: {
        education: 9,
        happiness: 3
      },
      position: [230, 150]
    },

    hospital: {
      name: "Больница",
      icon: "🏥",
      costs: [130, 80, 110],
      income: 1,
      effects: {
        health: 10,
        happiness: 5
      },
      position: [580, 150]
    },

    metro: {
      name: "Метро",
      icon: "🚇",
      costs: [250, 150, 200],
      income: 5,
      effects: {
        mobility: 15,
        economy: 5,
        happiness: 4
      },
      position: [330, 410]
    },

    recycling: {
      name: "Центр переработки",
      icon: "♻️",
      costs: [90, 60, 80],
      income: 3,
      effects: {
        ecology: 12,
        economy: 2
      },
      position: [620, 420]
    },

    solar: {
      name: "Солнечная станция",
      icon: "☀️",
      costs: [180, 110, 150],
      income: 9,
      effects: {
        ecology: 10,
        economy: 7
      },
      position: [700, 300]
    },

    market: {
      name: "Городской рынок",
      icon: "🏪",
      costs: [80, 55, 75],
      income: 12,
      effects: {
        economy: 8,
        happiness: 3
      },
      position: [220, 400]
    },

    housing: {
      name: "Жилой комплекс",
      icon: "🏢",
      costs: [160, 100, 140],
      income: 16,
      effects: {
        economy: 6,
        happiness: 4,
        mobility: -3
      },
      position: [530, 100]
    },

    bike: {
      name: "Велодорожки",
      icon: "🚲",
      costs: [60, 40, 55],
      income: 1,
      effects: {
        mobility: 8,
        ecology: 6,
        health: 3
      },
      position: [410, 500]
    },

    water: {
      name: "Очистная станция",
      icon: "💧",
      costs: [120, 75, 100],
      income: 2,
      effects: {
        ecology: 9,
        health: 8
      },
      position: [690, 500]
    },

    university: {
      name: "Университет",
      icon: "🎓",
      costs: [280, 180, 230],
      income: 10,
      effects: {
        education: 15,
        economy: 10
      },
      position: [90, 180]
    },

    stadium: {
      name: "Стадион",
      icon: "🏟️",
      costs: [200, 120, 160],
      income: 10,
      effects: {
        happiness: 9,
        health: 5,
        economy: 5
      },
      position: [500, 520]
    },

    tourism: {
      name: "Туристический центр",
      icon: "🏨",
      costs: [220, 140, 190],
      income: 20,
      effects: {
        economy: 14,
        happiness: 5,
        ecology: -3
      },
      position: [720, 100]
    }

  };


  /* =========================
     СОБЫТИЯ
     ========================= */

  const EVENTS = [

    {
      id: "eco",
      icon: "🌫️",
      title: "Экологический кризис",

      description:
        "Качество воздуха резко ухудшилось. Жители требуют действий.",

      choices: [

        {
          text: "Выделить 50 млн на очистку",
          cost: 50,

          effects: {
            ecology: 12,
            happiness: 4
          },

          result:
            "Программа очистки воздуха помогла стабилизировать ситуацию."
        },

        {
          text: "Ничего не делать",

          effects: {
            ecology: -12,
            happiness: -6
          },

          result:
            "Проблема продолжила ухудшаться."
        }

      ]
    },


    {
      id: "traffic",
      icon: "🚗",
      title: "Транспортный коллапс",

      description:
        "Утренние пробки парализовали несколько районов.",

      choices: [

        {
          text: "Вложить 70 млн в дороги",
          cost: 70,

          effects: {
            mobility: 12,
            economy: 3
          },

          result:
            "Транспортная ситуация заметно улучшилась."
        },

        {
          text: "Запустить дополнительные автобусы",
          cost: 30,

          effects: {
            mobility: 7,
            happiness: 3
          },

          result:
            "Общественный транспорт частично разгрузил дороги."
        },

        {
          text: "Ничего не делать",

          effects: {
            mobility: -10,
            happiness: -7
          },

          result:
            "Жители провели часы в пробках."
        }

      ]
    },


    {
      id: "hospital",
      icon: "🏥",
      title: "Перегрузка больниц",

      description:
        "Количество пациентов резко выросло.",

      choices: [

        {
          text: "Выделить 60 млн",
          cost: 60,

          effects: {
            health: 12,
            happiness: 5
          },

          result:
            "Больницы получили необходимые ресурсы."
        },

        {
          text: "Ничего не делать",

          effects: {
            health: -12,
            happiness: -8
          },

          result:
            "Медицинская система испытывает серьёзную нагрузку."
        }

      ]
    },


    {
      id: "tourists",
      icon: "🧳",
      title: "Интерес туристов",

      description:
        "Туристы начали проявлять интерес к вашему городу.",

      choices: [

        {
          text: "Инвестировать 40 млн",
          cost: 40,

          effects: {
            economy: 10,
            happiness: 4
          },

          result:
            "Туристический поток значительно вырос."
        },

        {
          text: "Ничего не делать",
          money: 70,

          effects: {
            economy: 3,
            happiness: -5
          },

          result:
            "Город получил быструю прибыль, но упустил возможность развития."
        }

      ]
    },


    {
      id: "investor",
      icon: "💼",
      title: "Новый инвестор",

      description:
        "Крупная компания предлагает открыть филиал в городе.",

      choices: [

        {
          text: "Предоставить льготы",
          money: 100,

          effects: {
            economy: 12
          },

          result:
            "Компания согласилась инвестировать в город."
        },

        {
          text: "Отказаться",

          effects: {
            economy: -2
          },

          result:
            "Город сохранил текущие условия."
        }

      ]
    },


    {
      id: "festival",
      icon: "🎉",
      title: "Городской фестиваль",

      description:
        "Организаторы предлагают провести крупный фестиваль.",

      choices: [

        {
          text: "Потратить 35 млн",
          cost: 35,

          effects: {
            happiness: 12,
            economy: 5
          },

          result:
            "Фестиваль стал главным событием месяца."
        },

        {
          text: "Провести небольшой фестиваль",
          cost: 10,

          effects: {
            happiness: 5,
            economy: 2
          },

          result:
            "Небольшой фестиваль прошёл успешно."
        }

      ]
    }

  ]; 
    /* =========================
     ЕЩЁ СОБЫТИЯ
     ========================= */

  EVENTS.push(

    {
      id: "school",
      icon: "📚",
      title: "Проблемы образования",

      description:
        "Школам не хватает современного оборудования.",

      choices: [

        {
          text: "Закупить оборудование",
          cost: 50,

          effects: {
            education: 10
          },

          result:
            "Учебный процесс улучшился."
        },

        {
          text: "Перенести финансирование",

          effects: {
            education: -5,
            economy: 3
          },

          result:
            "Средства были направлены на другие задачи."
        }

      ]
    },


    {
      id: "flood",
      icon: "🌧️",
      title: "Сильный ливень",

      description:
        "Несколько улиц оказались затоплены.",

      choices: [

        {
          text: "Ремонтировать ливневую систему",
          cost: 60,

          effects: {
            ecology: 5,
            happiness: 6,
            mobility: 7
          },

          result:
            "Ливневая система модернизирована."
        },

        {
          text: "Экстренная уборка",
          cost: 25,

          effects: {
            happiness: 3,
            mobility: 3
          },

          result:
            "Улицы постепенно вернулись в норму."
        }

      ]
    },


    {
      id: "power",
      icon: "⚡",
      title: "Энергетический сбой",

      description:
        "Несколько районов столкнулись с перебоями электричества.",

      choices: [

        {
          text: "Ремонтировать сеть",
          cost: 80,

          effects: {
            economy: 7,
            happiness: 5
          },

          result:
            "Энергоснабжение восстановлено."
        },

        {
          text: "Ввести временные ограничения",

          effects: {
            economy: -3,
            happiness: -8
          },

          result:
            "Система работает, но жители недовольны."
        }

      ]
    },


    {
      id: "grant",
      icon: "🏛️",
      title: "Государственный грант",

      description:
        "Город может получить грант на развитие инфраструктуры.",

      choices: [

        {
          text: "Подать заявку",
          money: 120,

          effects: {
            economy: 5
          },

          result:
            "Город получил дополнительное финансирование."
        },

        {
          text: "Не участвовать",

          effects: {},

          result:
            "Возможность была упущена."
        }

      ]
    }

  );


  /* =========================
     DOM-ЭЛЕМЕНТЫ
     ========================= */

  const $ = id =>
    document.getElementById(id);


  const startScreen =
    $("startScreen");

  const startBtn =
    $("startBtn");

  const projectsContainer =
    $("projects");

  const eventModal =
    $("eventModal");

  const eventTitle =
    $("eventTitle");

  const eventDescription =
    $("eventDescription");

  const eventIcon =
    $("eventIcon");

  const eventChoices =
    $("eventChoices");

  const finishModal =
    $("finishModal");


  /* =========================
     ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
     ========================= */

  function clamp(
    value,
    min = 0,
    max = 100
  ) {

    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    );
  }


  function money(value) {

    return Math.round(value)
      .toLocaleString("ru-RU");
  }


  function changeMetric(
    metric,
    value
  ) {

    if (
      state.metrics[metric] === undefined
    ) {
      return;
    }

    state.metrics[metric] =
      clamp(
        state.metrics[metric] + value
      );
  }


  function addNews(text) {

    state.news.unshift(text);

    if (
      state.news.length > 7
    ) {

      state.news.pop();

    }
  }


  function toast(message) {

    const element =
      $("toast");

    if (!element) return;

    element.textContent =
      message;

    element.classList.remove(
      "hidden"
    );

    clearTimeout(
      toast.timer
    );

    toast.timer =
      setTimeout(
        () => {

          element.classList.add(
            "hidden"
          );

        },
        2500
      );
  }


  /* =========================
     ФИНАНСЫ
     ========================= */

  function getIncome() {

    let income = 25;

    Object.entries(
      state.projects
    ).forEach(
      ([id, level]) => {

        const project =
          PROJECTS[id];

        if (!project) return;

        income +=
          project.income *
          level;
      }
    );

    income +=
      Math.floor(
        state.metrics.economy / 20
      );

    return income;
  }


  function getExpenses() {

    let expenses = 12;

    Object.entries(
      state.projects
    ).forEach(
      ([id, level]) => {

        if (
          !PROJECTS[id]
        ) {
          return;
        }

        expenses +=
          level * 2;
      }
    );

    return expenses;
  }


  /* =========================
     СОЗДАНИЕ КАРТОЧЕК
     ========================= */

  function getProjectLevel(id) {

    return state.projects[id] || 0;
  }


  function getProjectCost(id) {

    const project =
      PROJECTS[id];

    const level =
      getProjectLevel(id);

    if (
      level >=
      project.costs.length
    ) {

      return null;
    }

    return project.costs[level];
  }


  function createProjectCards() {

    if (!projectsContainer) {
      return;
    }

    projectsContainer.innerHTML =
      "";

    Object.entries(
      PROJECTS
    ).forEach(
      ([id, project]) => {

        const level =
          getProjectLevel(id);

        const cost =
          getProjectCost(id);

        const card =
          document.createElement(
            "div"
          );

        card.className =
          "project-card";

        card.dataset.project =
          id;

        card.innerHTML = `

          <div class="project-info">

            <div class="project-icon">
              ${project.icon}
            </div>

            <div>

              <h3>
                ${project.name}
              </h3>

              <small class="project-level">
                Уровень ${level}/3
              </small>

            </div>

          </div>


          <div class="project-bottom">

            <span class="project-cost">

              ${
                cost === null
                  ? "МАКСИМУМ"
                  : `${money(cost)} млн`
              }

            </span>

            <button>

              ${
                level === 0
                  ? "Построить"
                  : "Улучшить"
              }

            </button>

          </div>

        `;


        const button =
          card.querySelector(
            "button"
          );


        button.addEventListener(
          "click",
          () => {

            buildProject(id);

          }
        );


        projectsContainer.appendChild(
          card
        );

      }
    );
  }


  /* =========================
     ПОСТРОЙКА
     ========================= */
     function buildProject(id) {

  if (
    state.gameOver ||
    !state.started ||
    state.eventOpen
  ) {
    return;
  }

  const project =
    PROJECTS[id];

  if (!project) {
    return;
  }

  const level =
    getProjectLevel(id);

  const cost =
    getProjectCost(id);

  if (cost === null) {

    toast(
      "🏗️ Максимальный уровень"
    );

    return;
  }

  if (state.money < cost) {

    toast(
      "💸 Недостаточно денег"
    );

    return;
  }

  /*
    Покупка объекта
  */

  state.money -= cost;

  state.projects[id] =
    level + 1;

  /*
    Применяем эффект объекта
  */

  Object.entries(
    project.effects
  ).forEach(
    ([metric, value]) => {

      const multiplier =
        level === 0
          ? 1
          : 0.55;

      changeMetric(
        metric,
        Math.round(
          value * multiplier
        )
      );

    }
  );

  const message =
    level === 0
      ? `${project.icon} Построен объект: ${project.name}`
      : `${project.icon} Улучшен объект: ${project.name}`;

  addNews(message);

  toast(message);

  render();

  updateMap();

  saveGame();

  /*
    ПОКУПКА = ОДИН ХОД
  */

  setTimeout(
    () => {

      nextTurn();

    },
    500
  );

}
    /* =========================
     ОБНОВЛЕНИЕ ПОКАЗАТЕЛЕЙ
     ========================= */

  function updateMetrics() {

    const metrics = [
      "happiness",
      "ecology",
      "mobility",
      "education",
      "health",
      "economy"
    ];


    metrics.forEach(metric => {

      const value =
        Math.round(
          state.metrics[metric]
        );


      const valueElement =
        $(
          metric + "Value"
        );


      const barElement =
        $(
          metric + "Bar"
        );


      if (valueElement) {

        valueElement.textContent =
          value;

      }


      if (barElement) {

        barElement.style.width =
          value + "%";

      }

    });

  }


  /* =========================
     ОБНОВЛЕНИЕ БЮДЖЕТА
     ========================= */

  function updateBudget() {

    const moneyElement =
      $("money");


    if (moneyElement) {

      moneyElement.textContent =
        money(state.money) +
        " млн ₸";

    }


    const incomeElement =
      $("incomePerTurn");


    if (incomeElement) {

      incomeElement.textContent =
        "+" +
        getIncome() +
        " млн";

    }

  }


  /* =========================
     ОБНОВЛЕНИЕ ХОДА
     ========================= */

  function updateTurn() {

    const turnElement =
      $("turn");


    const newsTurn =
      $("newsTurn");


    if (turnElement) {

      turnElement.textContent =
        state.turn;

    }


    if (newsTurn) {

      newsTurn.textContent =
        "Ход " +
        state.turn;

    }

  }


  /* =========================
     НОВОСТИ
     ========================= */

  function renderNews() {

    const list =
      $("newsList");


    if (!list) {
      return;
    }


    list.innerHTML =
      "";


    state.news
      .slice(0, 5)
      .forEach(
        (item, index) => {

          const element =
            document.createElement(
              "div"
            );


          element.className =
            "news-item";


          element.innerHTML = `

            <span class="news-dot">
              ${index === 0 ? "●" : "○"}
            </span>

            <span>
              ${item}
            </span>

          `;


          list.appendChild(
            element
          );

        }
      );

  }


  /* =========================
     КАРТА ГОРОДА
     ========================= */

  function updateMap() {

    const container =
      $("projectObjects");


    if (!container) {
      return;
    }


    container.innerHTML =
      "";


    Object.entries(
      state.projects
    ).forEach(
      ([id, level]) => {

        const project =
          PROJECTS[id];


        if (!project) {
          return;
        }


        const [x, y] =
          project.position;


        const group =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );


        group.setAttribute(
          "transform",
          `translate(${x} ${y})`
        );


        group.classList.add(
          "map-project"
        );


        const circle =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );


        circle.setAttribute(
          "cx",
          "0"
        );


        circle.setAttribute(
          "cy",
          "0"
        );


        circle.setAttribute(
          "r",
          "24"
        );


        circle.setAttribute(
          "fill",
          "#fff"
        );


        circle.setAttribute(
          "stroke",
          "#222"
        );


        circle.setAttribute(
          "stroke-width",
          "3"
        );


        const text =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );


        text.setAttribute(
          "x",
          "0"
        );


        text.setAttribute(
          "y",
          "7"
        );


        text.setAttribute(
          "text-anchor",
          "middle"
        );


        text.setAttribute(
          "font-size",
          "18"
        );


        text.textContent =
          project.icon;


        const levelText =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );


        levelText.setAttribute(
          "x",
          "0"
        );


        levelText.setAttribute(
          "y",
          "38"
        );


        levelText.setAttribute(
          "text-anchor",
          "middle"
        );


        levelText.setAttribute(
          "font-size",
          "11"
        );


        levelText.setAttribute(
          "font-weight",
          "700"
        );


        levelText.textContent =
          "LVL " +
          level;


        group.appendChild(
          circle
        );


        group.appendChild(
          text
        );


        group.appendChild(
          levelText
        );


        container.appendChild(
          group
        );

      }
    );

  }


  /* =========================
     ОБЩИЙ RENDER
     ========================= */

  function render() {

    updateMetrics();

    updateBudget();

    updateTurn();

    renderNews();

    createProjectCards();

  }


  /* =========================
     СОБЫТИЯ
     ========================= */

  function randomEvent() {

    if (
      Math.random() > 0.42
    ) {

      return;

    }


    const event =
      EVENTS[
        Math.floor(
          Math.random() *
          EVENTS.length
        )
      ];


    showEvent(event);

  }


  function showEvent(event) {

    if (
      !eventModal ||
      !eventChoices
    ) {

      return;

    }


    state.eventOpen =
      true;


    state.lastEvent =
      event;


    eventIcon.textContent =
      event.icon;


    eventTitle.textContent =
      event.title;


    eventDescription.textContent =
      event.description;


    eventChoices.innerHTML =
      "";


    event.choices.forEach(
      choice => {

        const button =
          document.createElement(
            "button"
          );


        button.className =
          "event-choice";


        button.textContent =
          choice.text;


        button.addEventListener(
          "click",
          () => {

            chooseEvent(
              choice
            );

          }
        );


        if (
          choice.cost &&
          state.money <
          choice.cost
        ) {

          button.disabled =
            true;

          button.textContent +=
            " — недостаточно средств";

        }


        eventChoices.appendChild(
          button
        );

      }
    );


    eventModal.classList.remove(
      "hidden"
    );

  }


  function chooseEvent(choice) {

    if (
      choice.cost &&
      state.money <
      choice.cost
    ) {

      toast(
        "💸 Недостаточно денег"
      );

      return;

    }


    if (choice.cost) {

      state.money -=
        choice.cost;

    }


    if (choice.money) {

      state.money +=
        choice.money;

    }


    if (choice.effects) {

      Object.entries(
        choice.effects
      ).forEach(
        ([metric, value]) => {

          changeMetric(
            metric,
            value
          );

        }
      );

    }


    addNews(
      "⚡ " +
      choice.result
    );


    eventModal.classList.add(
      "hidden"
    );


    state.eventOpen =
      false;


    state.lastEvent =
      null;


    render();


    saveGame();


    toast(
      "Решение принято"
    );

  }


  /* =========================
     СЛЕДУЮЩИЙ ХОД
     ========================= */

  function nextTurn() {

    if (
      !state.started ||
      state.gameOver ||
      state.eventOpen
    ) {

      return;

    }


    const income =
      getIncome();


    const expenses =
      getExpenses();


    const balance =
      income -
      expenses;


    state.money +=
      balance;


    /*
      Небольшое естественное
      изменение показателей
    */

    if (
      state.metrics.economy >= 70
    ) {

      changeMetric(
        "happiness",
        1
      );

    }


    if (
      state.metrics.ecology < 35
    ) {

      changeMetric(
        "health",
        -1
      );

    }


    if (
      state.metrics.mobility < 35
    ) {

      changeMetric(
        "happiness",
        -1
      );

    }


    state.turn++;


    if (balance >= 0) {

      addNews(
        `💰 Бюджет получил ${balance} млн ₸ чистого дохода.`
      );

    } else {

      addNews(
        `📉 Расходы превысили доходы на ${Math.abs(balance)} млн ₸.`
      );

    }


    /*
      Население
    */

    const average =
      (
        state.metrics.happiness +
        state.metrics.economy +
        state.metrics.health
      ) / 3;


    if (
      average >= 70
    ) {

      state.population +=
        2500;

    } else if (
      average >= 50
    ) {

      state.population +=
        800;

    } else {

      state.population -=
        400;

    }


    if (
      state.money < 0
    ) {

      state.metrics.economy -=
        3;

      state.metrics.happiness -=
        4;

      addNews(
        "🚨 Город столкнулся с бюджетным дефицитом."
      );

    }


    render();

    updateMap();

    saveGame();


    /*
      Сначала проверяем конец игры,
      потом случайное событие.
    */

    if (
      state.turn > state.maxTurns
    ) {

      finishGame();

      return;

    }


    randomEvent();

  }


  /* =========================
     ФИНАЛЬНЫЙ ИНДЕКС
     ========================= */

  function calculateScore() {

    const values =
      Object.values(
        state.metrics
      );


    const average =
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      ) / values.length;


    const moneyBonus =
      Math.min(
        10,
        Math.max(
          0,
          state.money / 100
        )
      );


    return Math.round(
      clamp(
        average +
        moneyBonus
      )
    );

  }


  /* =========================
     КОНЕЦ ИГРЫ
     ========================= */

  function finishGame() {

    state.gameOver =
      true;


    state.started =
      false;


    const score =
      calculateScore();


    const finalScore =
      $("finalScore");


    const finalHappiness =
      $("finalHappiness");


    const finalEcology =
      $("finalEcology");


    const finalEconomy =
      $("finalEconomy");


    if (finalScore) {

      finalScore.textContent =
        score;

    }


    if (finalHappiness) {

      finalHappiness.textContent =
        Math.round(
          state.metrics.happiness
        );

    }


    if (finalEcology) {

      finalEcology.textContent =
        Math.round(
          state.metrics.ecology
        );

    }


    if (finalEconomy) {

      finalEconomy.textContent =
        Math.round(
          state.metrics.economy
        );

    }


    if (finishModal) {

      finishModal.classList.remove(
        "hidden"
      );

    }


    localStorage.removeItem(
      "merocity-save"
    );

  }
    /* =========================
     КНОПКА СЛЕДУЮЩЕГО ХОДА
     ========================= */

  
  /* =========================
     СТАРТ ИГРЫ
     ========================= */

  if (startBtn) {

    startBtn.addEventListener(
      "click",
      () => {

        state.started =
          true;

        state.gameOver =
          false;


        startScreen.classList.add(
          "hidden"
        );


        addNews(
          "🏙️ Новый аким приступил к работе."
        );


        render();

        updateMap();

        saveGame();

      }
    );

  }


  /* =========================
     СОХРАНЕНИЕ
     ========================= */

  function saveGame() {

    try {

      const saveData = {

        turn: state.turn,

        money: state.money,

        metrics:
          state.metrics,

        population:
          state.population,

        projects:
          state.projects,

        news:
          state.news,

        started:
          state.started,

        gameOver:
          state.gameOver

      };


      localStorage.setItem(
        "merocity-save",
        JSON.stringify(
          saveData
        )
      );

    } catch (error) {

      console.warn(
        "Не удалось сохранить игру:",
        error
      );

    }

  }


  /* =========================
     ЗАГРУЗКА
     ========================= */

  function loadGame() {

    try {

      const saved =
        localStorage.getItem(
          "merocity-save"
        );


      if (!saved) {

        return false;

      }


      const data =
        JSON.parse(
          saved
        );


      if (
        typeof data.turn ===
        "number"
      ) {

        state.turn =
          data.turn;

      }


      if (
        typeof data.money ===
        "number"
      ) {

        state.money =
          data.money;

      }


      if (
        data.metrics &&
        typeof data.metrics ===
        "object"
      ) {

        Object.keys(
          state.metrics
        ).forEach(
          metric => {

            if (
              typeof data.metrics[
                metric
              ] === "number"
            ) {

              state.metrics[
                metric
              ] =
                clamp(
                  data.metrics[
                    metric
                  ]
                );

            }

          }
        );

      }


      if (
        typeof data.population ===
        "number"
      ) {

        state.population =
          data.population;

      }


      if (
        data.projects &&
        typeof data.projects ===
        "object"
      ) {

        state.projects =
          data.projects;

      }


      if (
        Array.isArray(
          data.news
        )
      ) {

        state.news =
          data.news;

      }


      if (
        typeof data.started ===
        "boolean"
      ) {

        state.started =
          data.started;

      }


      if (
        typeof data.gameOver ===
        "boolean"
      ) {

        state.gameOver =
          data.gameOver;

      }


      /*
        Если сохранённая игра
        уже закончилась,
        начинаем новый экран.
      */

      if (
        state.gameOver
      ) {

        state.started =
          false;

        return false;

      }


      return true;

    } catch (error) {

      console.warn(
        "Сохранение повреждено:",
        error
      );

      return false;

    }

  }


  /* =========================
     ПРОДОЛЖЕНИЕ ИГРЫ
     ========================= */

  const loaded =
    loadGame();


  if (loaded) {

    startScreen.classList.add(
      "hidden"
    );


    addNews(
      "↩️ Игра восстановлена из сохранения."
    );


    render();

    updateMap();

  } else {

    /*
      Просто показываем
      начальное состояние.
    */

    render();

    updateMap();

  }


  /* =========================
     АВТОСОХРАНЕНИЕ
     ========================= */

  setInterval(
    () => {

      if (
        state.started &&
        !state.gameOver
      ) {

        saveGame();

      }

    },
    10000
  );


  /* =========================
     КЛАВИША ENTER
     ========================= */

  
  /* =========================
     ФИНАЛЬНЫЙ ЗАПУСК
     ========================= */

  console.log(
    "MeroCity запущен успешно."
  );

});