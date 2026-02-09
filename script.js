// 用户选择的答案
const answers = {
    home: null,
    redpacket: null,
    overtime: null,
    pressure: null,
    chunwan: null,
    fireworks: null,
    dumplings: null,
    couplets: null,
    newclothes: null,
    visit: null,
    mahjong: null,
    reunion: null,
    paynewyear: null,
    receive: null
};

// 年味等级定义
const levels = [
    { min: 0, max: 10, title: "年味稀薄 ☕", description: "这是过年吗？感觉像普通周末..." },
    { min: 11, max: 25, title: "年味淡如水 💧", description: "宅家过年族，年味都被Wi-Fi信号吸收了" },
    { min: 26, max: 40, title: "年味若有若无 🤔", description: "勉强算过年，但总觉得少了点什么" },
    { min: 41, max: 55, title: "年味半糖半甜 🍯", description: "还行还行，有点过年的意思了" },
    { min: 56, max: 70, title: "年味刚刚好 😊", description: "标准的过年模式，中规中矩" },
    { min: 71, max: 85, title: "年味浓郁 🎆", description: "很充实！这才是该有的春节氛围" },
    { min: 86, max: 95, title: "年味超标 🎉", description: "年味太足了！你是过年专业户吧？" },
    { min: 96, max: 100, title: "年味天花板 🏆", description: "完美春节！你就是年味本味！" }
];

// 获取所有选项按钮
const optionButtons = document.querySelectorAll('.option-btn');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultCard = document.getElementById('result');

// 处理选项按钮点击
optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const question = button.dataset.question;
        const value = button.dataset.value;

        // 移除同一问题的其他选项的选中状态
        document.querySelectorAll(`.option-btn[data-question="${question}"]`).forEach(btn => {
            btn.classList.remove('selected');
        });

        // 标记当前选项为选中
        button.classList.add('selected');
        answers[question] = value;
    });
});

// 计算年味指数
function calculateScore() {
    let score = 0;

    // 基础分数
    if (answers.home === 'yes') score += 30;          // 回家过年
    if (answers.redpacket === 'yes') score += 20;      // 发红包
    if (answers.overtime === 'yes') score -= 30;       // 春节加班
    if (answers.pressure === 'yes') score += 15;       // 被催婚催生
    if (answers.chunwan === 'yes') score += 10;        // 看春晚
    if (answers.fireworks === 'yes') score += 15;      // 放烟花/鞭炮
    if (answers.dumplings === 'yes') score += 10;      // 吃饺子
    if (answers.couplets === 'yes') score += 10;       // 贴春联
    if (answers.newclothes === 'yes') score += 10;     // 穿新衣
    if (answers.visit === 'yes') score += 15;          // 走亲戚
    if (answers.mahjong === 'yes') score += 10;        // 打麻将/打牌
    if (answers.reunion === 'yes') score += 15;        // 吃年夜饭
    if (answers.paynewyear === 'yes') score += 15;     // 拜年
    if (answers.receive === 'yes') score += 20;        // 收到红包

    // 特殊加成
    // 吃年夜饭 + 看春晚 = 完美除夕夜
    if (answers.reunion === 'yes' && answers.chunwan === 'yes') {
        score += 5;
    }

    // 放烟花 + 贴春联 = 传统年味组合
    if (answers.fireworks === 'yes' && answers.couplets === 'yes') {
        score += 5;
    }

    // 拜年 + 走亲戚 = 社交达人
    if (answers.paynewyear === 'yes' && answers.visit === 'yes') {
        score += 5;
    }

    // 发红包 + 收到红包 = 有来有往
    if (answers.redpacket === 'yes' && answers.receive === 'yes') {
        score += 10;
    }

    // 回家过年 + 春节加班 = 打工人悲歌
    if (answers.home === 'yes' && answers.overtime === 'yes') {
        score -= 10;
    }

    // 被催婚催生 + 打麻将 = 缓解压力
    if (answers.pressure === 'yes' && answers.mahjong === 'yes') {
        score += 5;
    }

    // 穿新衣 + 拜年 = 精神小伙/小妹
    if (answers.newclothes === 'yes' && answers.paynewyear === 'yes') {
        score += 5;
    }

    // 确保分数在0-100之间
    score = Math.max(0, Math.min(100, score));

    return score;
}

// 获取年味等级
function getLevel(score) {
    for (const level of levels) {
        if (score >= level.min && score <= level.max) {
            return level;
        }
    }
    return levels[levels.length - 1];
}

// 显示结果
function showResult() {
    const score = calculateScore();
    const level = getLevel(score);

    document.getElementById('scoreValue').textContent = score + '%';
    document.getElementById('levelTitle').textContent = level.title;
    document.getElementById('levelDescription').textContent = level.description;

    resultCard.classList.remove('hidden');
}

// 重置测评
function resetQuiz() {
    // 清空答案
    for (const key in answers) {
        answers[key] = null;
    }

    // 移除所有选中状态
    optionButtons.forEach(button => {
        button.classList.remove('selected');
    });

    // 隐藏结果
    resultCard.classList.add('hidden');
}

// 计算按钮点击事件
calculateBtn.addEventListener('click', () => {
    // 检查是否所有问题都已回答
    const allAnswered = Object.values(answers).every(answer => answer !== null);

    if (!allAnswered) {
        alert('请回答所有问题后再计算年味指数！🙏');
        return;
    }

    showResult();
});

// 重置按钮点击事件
resetBtn.addEventListener('click', resetQuiz);