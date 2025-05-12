---
author: ZHQ
pubDatetime: 2024-01-10T19:13:00+08:00
title: 'React 的“声明式 UI'
featured: false
draft: false
tags:
  - 'React'
description: '聊聊 React 中的 useEffect：什么时候你可能真的不需要它'
---

## 聊聊 React 的“声明式 UI”：它凭什么让我们少操那么多心

在日常工作中，尤其是在前端领域摸爬滚打久了，或多或少都会对“开发效率”和“代码可维护性”这些话题特别敏感。最近我在回顾一些 React 项目的开发历程时，又一次被它推崇的`声明式 UI`这个理念深深触动。我发现，这个看似简单的概念，实则可能是我们能够更从容地构建复杂用户界面，并且在项目迭代中少掉点头发的关键所在。

刚接触前端那会儿，我们可能都经历过那种直接操作 DOM 节点的“手工作坊”时代，用 `document.getElementById`、`appendChild` 这些 API 一步步地去“指挥”浏览器绘制界面。那种感觉，就像是你在给一个非常听话但没有任何主观能动性的机器人下达精确到每一个动作的指令。虽然直接，但当界面逻辑复杂起来，状态一多，那维护起来简直就是一场噩梦，代码很快就会变得难以理解和追踪。

后来，当我们开始拥抱像 React 这样的现代前端框架时，一个非常直观的感受就是：我们好像不用再那么事无巨细地去关心 DOM 到底是怎么变化的了。我们更多的是在描述“在某种状态下，我的界面应该是什么样子”。这种转变，其实就是从“命令式”到“声明式”的飞跃。

所以，今天我想和大家一起深入探讨一下，React 所倡导的这种“声明式 UI”究竟是什么？它和我们曾经熟悉的“命令式 UI”又有哪些本质的区别？以及，最关键的是，它到底为我们开发者带来了哪些实实在在的好处，让我们能把更多的精力放在业务逻辑和用户体验的打磨上。

### “声明什么” vs “命令怎么做”：UI 构建的两种哲学

在咱们一头扎进 React 的声明式魔法之前，非常有必要先把这两个核心概念掰扯清楚：**声明式 UI (Declarative UI)** 和 **命令式 UI (Imperative UI)**。这不仅仅是两个术语，它们背后代表的是两种截然不同的 UI 构建和思考方式。

简单来说，我们可以这样理解它们的核心区别：

*   **声明式 UI**：你只需要告诉框架，你期望最终的用户界面**长什么样 (the "what")**。至于如何一步步地把这个期望的界面高效、准确地渲染出来，以及当数据变化时如何智能地更新界面，这些繁琐的“如何做 (the "how")”的细节，框架会帮你搞定。开发者更像是一位建筑设计师，只需要画出蓝图，具体的施工细节由专业的施工队（框架）负责。
*   **命令式 UI**：你就必须亲力亲为，一步一步地、明确地指示浏览器**具体要怎么操作 (the "how")** 才能达到你想要的界面效果。比如，“首先，你得找到页面上 ID 为 `myMessage` 的那个段落元素；然后，把它的文字内容修改成‘欢迎回来！’；接着，如果用户未登录，再把它隐藏掉……” 开发者更像是一位事必躬亲的工头，需要指挥工人完成每一个具体的动作。

这种描述可能还是有点抽象，对吧？没关系，咱们是开发者，代码是最好的沟通语言。让我们通过具体的代码示例，来感受一下这两种模式在实际编码中的直观差异。

### 声明式 UI 在 React 中的体现：我们如何“告诉”React 想要什么？

在 React 的世界里，我们通常使用 JSX (一种看起来很像 HTML 的 JavaScript 语法扩展) 来描述在特定的应用状态 (state) 下，UI 应该呈现的“理想形态”。

你可以把 JSX 看作是我们向 React 提交的一份“UI 订单”。这份订单上清晰地写着：“当 `isLoggedIn` 这个状态为 `true` 的时候，我希望界面上显示一段‘欢迎！’的文字；而当它为 `false` 的时候，则显示‘请登录。’。”

```jsx
import React, { useState } from "react";

function WelcomeMessage() {
  // 我们用 useState 来管理一个表示用户登录状态的布尔值
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 这里就是声明式的核心：
  // 我们并没有去写任何 document.getElementById 之类的 DOM 操作代码
  // 而是直接用 JSX 描述了在不同 isLoggedIn 状态下，UI 应该是什么样子
  return (
    <div>
      {isLoggedIn ? <p>欢迎！</p> : <p>请登录。</p>}
      {/* 我们可以加个按钮来模拟状态切换 */}
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? '登出' : '登录'}
      </button>
    </div>
  );
}

export default WelcomeMessage;
```

![React 声明式 UI 概念图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/LKMZNv.png)

请注意看上面代码的 `return` 部分。我们开发者所做的，仅仅是基于 `isLoggedIn` 这个状态，用一种非常直观的方式“声明”了期望的 UI 输出。我们完全没有操心当 `isLoggedIn` 的值从 `false` 变为 `true` 时，那个 `<p>` 标签内部的文本是如何被替换掉的，也没有关心旧的 DOM 节点是如何被移除，新的 DOM 节点是如何被添加的。

这些脏活累活，React 在它的“虚拟 DOM (Virtual DOM)”和高效的 Diff 算法的帮助下，都替我们默默地完成了。我们只需要关注“在什么状态下，显示什么”，而“如何高效地做到这一点”，则是 React 框架的核心职责。

这就是我在文章开头提到的，为什么声明式 UI 能让我们“少操那么多心”。我们把关注点从繁琐的底层 DOM 操作，提升到了更高层次的“状态到 UI 的映射关系”上。

### 回顾命令式 UI：那些我们曾经“手动挡”操作 DOM 的日子

为了更好地理解声明式 UI 的优势，我们不妨回头看看，如果用传统的命令式方式来实现类似的功能，代码会是什么样子。这里我们用原生 JavaScript 来举例：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>命令式 UI 示例</title>
</head>
<body>
  <p id="messageElement"></p>
  <button id="toggleButton">请登录</button>

  <script>
    let isLoggedIn = false;
    const messageElement = document.getElementById("messageElement");
    const toggleButton = document.getElementById("toggleButton");

    // 我们需要一个专门的函数来手动更新 UI
    function updateUI() {
      if (isLoggedIn) {
        messageElement.textContent = "欢迎！";
        toggleButton.textContent = "登出";
      } else {
        messageElement.textContent = "请登录。";
        toggleButton.textContent = "登录";
      }
    }

    // 初始化 UI
    updateUI();

    // 给按钮添加点击事件，在事件处理函数中：
    // 1. 改变状态
    // 2. 手动调用 updateUI 函数来更新 DOM
    toggleButton.addEventListener('click', () => {
      isLoggedIn = !isLoggedIn; // 切换状态
      updateUI(); // 手动触发 UI 更新
    });
  </script>
</body>
</html>
```

![命令式 UI 手动操作 DOM 示意图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/tGiGuT.png)

大家可以对比一下这两段代码。在命令式的版本里，我们必须：

1.  **显式地获取 DOM 元素**：通过 `document.getElementById`。
2.  **编写具体的 DOM 操作指令**：例如 `messageElement.textContent = "..."`。
3.  **在状态改变后，手动调用更新 UI 的函数**：这是最关键的一点，UI 的更新时机和具体操作完全由我们开发者自己控制和负责。

如果这个组件的逻辑再复杂一点，比如有更多的状态、更多的交互、更动态的 UI 结构变化，那么 `updateUI` 这个函数很快就会变得臃肿不堪，充斥着各种条件判断和琐碎的 DOM 操作。代码的可读性和可维护性会急剧下降，而且非常容易出错（比如忘记更新某个相关的 DOM 元素，或者更新顺序不对导致界面闪烁等）。

#### 关于命令式 UI 的一个小补充

这里可能有些伙伴会想：“就算用原生 JS，我也可以用 `if` 语句或者三元运算符来根据条件决定显示什么文本啊，这不也挺‘声明’的吗？”

比如这样：

```javascript
const isLoggedIn = true;
let messageContent = '';

// 根据状态决定消息内容
if (isLoggedIn) {
  messageContent = '欢迎！';
} else {
  messageContent = '请登录。';
}

// 依然需要手动将内容更新到 DOM
const pElement = document.createElement('p');
pElement.textContent = messageContent;
document.body.appendChild(pElement);
```

这个思考很有道理！确实，在决定“显示什么内容”这个层面，我们可以写出看似声明式的逻辑。但是，<span class="text-red-500">只要你最终还是需要自己编写代码去直接操作 DOM（比如 `createElement`, `appendChild`, `textContent = ...`），那么从整体的 UI 更新机制来看，它依然是命令式的。</span>

声明式 UI 的精髓在于，你不仅声明了“理想状态”下的 UI 结构，更重要的是，**框架负责将这个“理想状态”自动地、高效地映射到实际的 UI 上，并处理后续所有的状态变更和 UI 更新。** 开发者从“如何更新”的细节中被解放了出来。

### 声明式 UI 究竟为我们开发者带来了什么价值？

好了，通过上面的对比和分析，相信大家对声明式 UI 和命令式 UI 的区别已经有了比较清晰的认识。那么，React 这种声明式的编程范式，具体能为我们开发者带来哪些实实在在的好处呢？在我看来，主要有以下几点：

1.  **代码更易于理解和维护 (更高的可读性)**：
    当我们阅读 React 组件的代码时，我们主要关注的是 `render` (或函数组件的返回) 部分的 JSX。这段 JSX 清晰地描述了在当前 props 和 state 下，这个组件应该渲染成什么样子。我们不需要去追踪一系列的 DOM 操作指令来推断 UI 的最终形态。这种“所见即所得”的描述方式，使得代码逻辑更直观，也更容易被团队中的其他成员理解。当需求变更或需要修复 bug 时，我们能更快地定位到相关的 UI 逻辑。

2.  **开发效率的提升 (更少的冗余代码)**：
    由于框架接管了繁琐的 DOM 操作，我们不再需要为每一种状态变化都编写对应的 DOM 更新代码。这大大减少了我们的编码量，特别是对于那些交互复杂、状态多变的组件。我们可以把更多的精力投入到业务逻辑的实现和组件状态的设计上，而不是淹没在 DOM API 的细节里。

3.  **减少出错的可能性 (更高的可靠性)**：
    手动操作 DOM 是一个非常容易出错的过程。我们可能会忘记更新某个相关的元素，或者在更新顺序上出现问题，导致 UI 状态不一致或出现奇怪的 bug。React 通过其虚拟 DOM 和 Diff 算法，能够精确且高效地计算出最小的 DOM 变更，并自动应用这些变更。这不仅提升了性能，也极大地降低了因手动操作 DOM 而引入错误的风险。

4.  **更易于进行组件化和复用**：
    声明式 UI 的组件更容易被抽象和复用。因为组件的输出（UI 结构）只依赖于其输入（props 和 state），并且它不直接操作外部 DOM，这使得组件的边界更清晰，耦合度更低。我们可以像搭积木一样，将这些高内聚、低耦合的声明式组件组合起来，构建出复杂的用户界面。

5.  **跨平台渲染的可能性 (例如 React Native)**：
    声明式的理念并不仅限于 Web DOM。因为我们描述的是“UI 应该是什么样子”，而不是“如何在浏览器中操作 DOM”，这使得同样的声明式逻辑可以被适配到不同的渲染目标。React Native 就是一个很好的例子，它允许我们用相同的 React 声明式语法来构建原生移动应用 (iOS 和 Android) 的界面。

当然，声明式 UI 也并非万能药，它也有其自身的复杂性（比如理解虚拟 DOM、Diff 算法、状态管理模式等）。但总体而言，对于构建现代的、复杂的、数据驱动的 Web 应用来说，它所带来的好处是显而易见的。

### 我们在用 React 时，还会遇到命令式的场景吗？

这是一个非常好的问题！虽然 React 鼓励我们用声明式的方式来构建 UI，但在某些特定的场景下，我们可能仍然需要，或者说更方便地使用命令式的方式来与 DOM 或某些不受 React 控制的组件进行交互。

React 为此也提供了一些“逃生舱口”，比如：

*   **Refs**: 当我们需要直接访问底层的 DOM 元素（例如，管理焦点、触发动画、或者与第三方 DOM 库集成时），可以使用 Refs。通过 Ref 获取到 DOM 节点后，我们就可以对其进行命令式的操作。
    ```jsx
    import React, { useRef, useEffect } from 'react';

    function MyInput() {
      const inputRef = useRef(null);

      useEffect(() => {
        // 组件加载后，自动聚焦到输入框
        // 这里就是命令式操作
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, []);

      return <input ref={inputRef} type="text" />;
    }
    ```
*   **与非 React 管理的库集成**：比如，你可能需要在一个 React 应用中集成一个 jQuery 插件或者一个原生的图表库。这种情况下，你可能需要在 React 组件的生命周期方法（如 `useEffect`）中，通过命令式的方式来初始化、更新或销毁这些外部库的实例。

重要的是要理解，<span className="text-red-500">这些命令式的操作通常应该被限制在尽可能小的范围内，并且最好封装在特定的组件或 Hook 中，以避免污染大部分保持声明式风格的代码。</span>React 的核心理念依然是声明式的，这些命令式的“逃生舱口”是为了解决特定问题而存在的补充。

### 总结与思考：拥抱声明式，让开发更专注

回顾我们从命令式到声明式的转变，不仅仅是编码方式的改变，更是思维方式的升级。React 的声明式 UI 让我们能够从繁琐的 DOM 操作细节中解脱出来，将注意力更多地集中在**数据状态如何驱动用户界面**这个核心问题上。

![声明式开发带来的专注提升](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/vj4415.png)

这就像我们从手动挡汽车换到了自动挡汽车。虽然手动挡能让你对车辆的每一个机械动作都有直接的控制感，但自动挡无疑让你在驾驶过程中更轻松，能把更多注意力放在路况和导航上。

当然，没有任何一种范式是完美的。理解声明式 UI 的原理、虚拟 DOM 的工作机制以及 React 的状态管理，对于真正发挥其威力至关重要。但一旦我们掌握了这些，就能体会到它在构建可维护、可扩展、高质量用户界面方面带来的巨大便利。

未来，随着前端技术的不断发展，我们可能会看到更多基于声明式理念的创新。但万变不离其宗，帮助开发者更高效、更愉悦地创造价值，始终是技术演进的核心驱动力。