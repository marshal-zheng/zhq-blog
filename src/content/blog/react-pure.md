---
author: ZHQ
pubDatetime: 2024-03-15T20:18:00+08:00
title: 'React 组件的 纯粹性'
featured: false
draft: false
tags:
  - 'React'
description: '聊聊 React 组件的“纯粹性”：为何它是我们代码质量的生命线'
---

在与 React 打交道的过程中, 相信在座的各位或多或少听说过一个核心原则：“**React 组件应该是纯粹的 (Components should be pure)**”。这不仅仅是一句口号，更是 React 设计哲学中一条非常重要的规则。如果我们不小心打破了这条规则，写出了“不纯粹”的组件，那么各种令人头疼的问题就可能接踵而至：

*   组件的行为可能和你预期的不一致，表现得神神秘秘。
*   即使当前看起来一切正常，未来某次看似无关的修改，却可能导致它突然罢工。
*   React 的一些优化机制（比如未来的 React Compiler）可能会因为组件的不纯粹而产生意想不到的 bug。
*   我们可能无法顺畅地享受到 React 新特性带来的便利，甚至在 React 版本升级时踩到兼容性的坑。
*   最直接的，不纯粹的组件往往意味着更难阅读、更难维护的代码。

那么，问题来了：到底什么是所谓的组件“纯粹性”？对于很多经验丰富的 React 开发者来说，这可能更多的是一种“只可意会，不可言传”的直觉。但如果真要让我们清晰、准确地向他人解释“纯粹性”的定义和内涵，恐怕不少人还是会感到有些力不从心。

因此，今天这篇文章，我就想和大家一起，尽可能细致地、深入地探讨一下 React 组件的纯粹性到底是怎么一回事，并希望能解答大家心中关于 React 纯粹性的种种疑问。

### 先瞅瞅官方文档怎么说

我这里引用一下官方文档中几个一针见血的观点，它们用相对简单的语言和具体的例子，尝试为我们揭开纯粹性的面纱：

[React 官方文档 - Keeping Components Pure](https://react.dev/learn/keeping-components-pure)

> 在计算机科学领域（尤其是在函数式编程的世界里），一个**纯函数 (pure function)** 通常具备以下特征：
>
> 1.  **只关注自己的工作**： <span className="text-red-500">它不会在其执行过程中修改任何在它被调用之前就已经存在的对象或变量</span>（比如：全局变量、函数外部的对象、模块作用域下的数据、window 上的属性、外部数组、外部对象的属性等）。
> 2.  **相同的输入，相同的输出**：<span className="text-red-500">只要给定相同的输入参数，一个纯函数总是会返回完全相同的结果。</span>
>
> React 的设计理念正是围绕着这个概念构建的：它**假设你编写的每一个组件都是一个纯函数**。这意味着，你编写的任何 React 组件，在接收到相同的输入 (props 和 state) 时，都应该总是返回相同的 JSX 结构。
>
> **React 的渲染过程必须始终是纯粹的**：组件应该只负责返回 JSX，并且在渲染期间不应该修改任何在其渲染之前就已经存在的对象或变量。否则，这个组件就是“不纯粹”的！

官方文档的这些描述当然是准确无误的。但我相信，为了让更广泛的开发者群体——从那些读过官方文档但仍感觉“隔靴搔痒”的伙伴，到那些可能没细读过文档但凭经验对纯粹性有模糊认知的开发者，再到那些对纯粹性完全没有概念的新手朋友们——都能真正理解其精髓，我们非常有必要把这些“言外之意”和“字里行间”的深层含义再挖掘得更透彻一些。当然，本文会假设读者对 React 的基本用法已经有了一定的了解。

### 究竟什么是“纯粹性”？从函数式编程的根源谈起

在我们一头扎进 React 的具体规则之前，让我们先花点时间，仔细琢磨一下“纯粹 (pure)”这个词本身的含义。

“纯粹性”通常是用来描述**函数**的一种属性。我们经常会听到“纯函数 (pure function)”和“非纯函数 (impure function)”这样的说法。在 React 的世界里，组件（我们暂时忽略类组件的复杂性，专注于函数组件 [^1]）其本质上就是函数。所以，当我们说一个 React 组件是“纯粹”的，我们大致上可以理解为：**这个组件在作为函数的视角下，是符合纯函数定义的。**

那么，一个标准的“纯函数”到底长什么样呢？这其实并不是 React 特有的概念，它在函数式编程社区中早已广为人知。通常来说，一个纯函数需要同时满足以下两个核心标准：

1.  **没有副作用 (No Side Effects)**：这意味着函数在执行过程中，除了计算并返回一个值之外，不会对函数外部的任何状态产生任何可观察到的影响。它不会修改外部变量，不会进行 I/O 操作（比如读写文件、发送网络请求），不会在控制台打印日志等等。它就像一个“黑箱”，只根据输入默默计算结果。
2.  **引用透明性 (Referential Transparency)**：这意味着只要函数的输入参数完全相同，无论你调用多少次这个函数，在任何时间、任何地点调用，它都必须返回完全相同的结果。你可以把函数调用表达式直接替换为其返回值，而不会改变程序的任何行为。

不过，关于“纯粹性”的具体定义，似乎也存在一些不同的流派和解读。例如，如果我们把“从函数外部读取某些信息”也算作一种副作用的话，那么“引用透明性”似乎就可以被“没有副作用”这个条件所包含了。

#### 跳出定义之争：在 React 的语境下，我们为何需要纯粹性？

在这里，我想引入一个我最近在一次关于纯粹性和副作用的讨论中看到的、让我觉得非常有启发性的思考方式。用我自己的话来说就是：**试图去寻找一个放之四海而皆准的、适用于所有场景的“纯粹性”的通用定义，可能意义并不大。相反，我们更应该在特定的上下文中去思考：“一个函数保持纯粹，究竟能带来什么好处？”换句话言之，我们应该从“成为纯函数所能带来的益处”出发，来反过来定义和理解在该上下文中“纯粹性”的内涵。**

简而言之，既然我们这次讨论的是 React 组件的纯粹性，那么我们就可以思考一种“**在 React 语境下的纯粹性定义**”。当然，这种“自定义”也是有边界的。毕竟我们借用的是在其他领域（如函数式编程）也被广泛使用的术语，所以我们不能过于天马行空，仍然需要尊重大家对“纯粹性”的基本共识。

那么，React 组件为什么必须保持纯粹呢？<span className="text-red-500">最根本的原因在于 React 自身的一些核心特性和行为机制对组件的纯粹性有着强烈的依赖</span>，例如：

*   **Suspense (异步处理)**：允许组件“暂停”渲染，等待数据加载完成。
*   **Concurrent Rendering (并发渲染)**：允许 React 同时处理多个渲染任务，并根据优先级中断和恢复渲染。
*   **高级任务调度 (Advanced Job Scheduling)**：React 内部对渲染任务的智能调度和优化。
*   **React Compiler (未来的编译时优化)**：通过在编译阶段分析和重写代码，自动进行性能优化。

换句话说，**在 React 语境下的“纯粹性”定义，就应该是那些能够确保上述这些强大特性得以正确、可靠地实现所必需满足的条件。**

话虽如此，最终当我们判断一个 React 组件是否纯粹时，基本上还是可以回归到前面提到的那两个核心标准：**没有副作用**和**引用透明性**。但是，如果深入思考细节，我们可能需要对这两个标准在 React 的具体场景下进行一些微调和适配，这一点我稍后会详细解释。我想在这里强调的是，像这样根据特定上下文来调整“纯粹性”的定义，并非什么异端邪说，反而是为了能够更有效地在 React 的世界里运用“纯粹性”这个强大概念所必需的务实做法。

### “副作用”的典型案例：哪些行为会让你的 React 组件“不纯”？

React 组件必须是纯粹的，这意味着在它们的**渲染期间 (during rendering)** 不能产生副作用。为了让大家对 React 组件中的“副作用”有一个更直观的认识，我们来看几个典型的、会导致组件“不纯”（也就是“不合格”）的例子。

（*温馨提示：从现在开始，为了简化讨论，我会将“从外部读取信息导致不符合引用透明性”的情况，也广义地归类为“副作用”。这主要是因为在 React 社区的讨论中，大家通常也习惯将这类问题统称为“副作用”，并且严格区分“副作用”和“引用透明性”这两个术语的细微差别反而容易让初学者感到困惑。*）

#### 1. 在组件渲染期间，修改组件外部的变量

```javascript
let globalRenderCount = 0;

const ImpureCounterDisplay: React.FC = () => {
  // 糟糕！在组件渲染期间修改了外部变量
  globalRenderCount++;
  return <div>全局渲染次数: {globalRenderCount}</div>;
};
```

这个例子展示了一个非常直接的副作用：在函数组件 `ImpureCounterDisplay` 的执行体（也就是渲染逻辑）内部，我们直接修改了定义在组件外部的变量 `globalRenderCount`。这是一种典型的“外部写入”行为。

为什么在 React 的语境下，我们绝对不能这么做呢？核心原因在于，**React 并不保证一个函数组件的执行体（也就是它的渲染函数）在一次“逻辑上的组件渲染”中，到底会被实际执行多少次，以及何时执行。** “我在 JSX 中写了一个 `<ImpureCounterDisplay />`，所以这个组件函数就会被执行一次”——这种简单的一一对应关系，在 React 中是**不成立**的，尤其是在未来并发模式和编译器优化下。

在最简单的情况下，比如 `render(<ImpureCounterDisplay />);`，这个函数体可能确实只执行一次。但即便如此，React 规范也没有对此做出任何承诺。在更复杂的场景中，例如当组件被包裹在 `<Suspense>` 中，或者与其他组件协同工作时，`ImpureCounterDisplay` 的执行次数可能会受到外部因素（比如 `OtherComponent` 的行为）的影响而被多次调用：

```jsx
<Suspense fallback={<p>加载中...</p>}>
  <ImpureCounterDisplay />
  <OtherComponent />
</Suspense>
```

在这种情况下，`ImpureCounterDisplay` 函数体被实际执行的次数，就完全取决于外部因素了。如果一个组件的行为（比如它显示的 `globalRenderCount` 的值）依赖于这种不可预测的外部执行次数，那么这个组件的规范就变得非常模糊和不可靠，这显然不是我们想要的。

#### 2. 在组件渲染期间，从外部读取不稳定的数据源

```javascript
const UserGreeting: React.FC = () => {
  // 糟糕！在渲染期间直接读取 localStorage
  const currentUserId = localStorage.getItem("userId");
  return <p>当前用户ID: {currentUserId || '未登录'}</p>;
};
```

在这个例子中，我们在组件 `UserGreeting` 的渲染逻辑中，直接从 `localStorage` 读取数据。这同样会让组件变得不纯粹，因为它依赖于一个在组件外部的、并且可能在两次渲染之间发生变化的状态。

正如前面所说，React 为了渲染一个 `<UserGreeting />` 组件，可能会在不同时间点多次执行 `UserGreeting` 这个函数。如果在这多次执行之间，`localStorage.getItem("userId")` 的返回值发生了变化（比如用户在另一个标签页登录或退出了），那么 `UserGreeting` 组件在逻辑上明明是“同一次渲染”（相同的 props 和内部 state），却可能因为执行时机的不同而展示出不同的内容。这就破坏了组件行为的确定性，使得组件的规范变得难以捉摸。

#### 3. 相同的输入，却可能产生不同的输出（随机性）

```javascript
const RandomLuckyDraw: React.FC = () => {
  // 糟糕！渲染结果依赖于随机数
  if (Math.random() < 0.1) {
    return <p>恭喜你，中奖了！</p>;
  } else {
    return <p>很遗憾，未中奖。</p>;
  }
};
```

虽然这个例子可以看作是第二种情况（读取外部不确定性来源——`Math.random()`）的一个变种，但它更直接地违反了“相同输入，相同输出”的原则。如果 `RandomLuckyDraw` 组件被 React 多次执行（即使 props 完全相同），它每次返回的 JSX 都可能是不同的。

React 是一个用于构建**声明式**用户界面的库，它要求我们编写的组件也应该是声明式的。如果一个组件的输出会因为输入之外的因素（比如随机性、当前时间等）而随意变化，那么它就破坏了声明式编程的核心优势，是应该极力避免的。

#### 4. 在组件渲染期间输出日志

```javascript
const DebugLogger: React.FC<{ message: string }> = ({ message }) => {
  // 注意：这在渲染期间也是一种副作用
  console.log(`正在渲染 DebugLogger: ${message}`);

  return <p>这里显示一些有用的内容：{message}</p>;
};
```

像这样在组件渲染逻辑中使用 `console.log` 输出日志，严格来说也算是一种副作用（因为它对外部环境——控制台——产生了影响）。不过，在前端开发中，我们通常只会在调试阶段这么做。所以，我不会说调试时绝对不能用 `console.log`。只要你清楚地理解：**React 不保证组件函数在一次渲染中具体执行几次、何时执行**，那么在调试时用它来帮助你理解当前程序的运行状态是完全没问题的。当然，调试完成后，这些日志输出应该被移除或关闭。

#### 5. 在组件渲染期间发起网络请求

```javascript
const UserProfilePage: React.FC<{ userId: string }> = ({ userId }) => {
  // 极其糟糕！在渲染期间直接发起 fetch 请求
  fetch(`/api/user/${userId}/profile-view-log`, {
    method: 'POST',
    body: JSON.stringify({ timestamp: Date.now() }),
  });

  return (
    <section>
      <h1>用户 {userId} 的个人主页</h1>
      {/* ...其他个人主页内容... */}
    </section>
  );
};
```

在组件渲染期间直接发起像 `fetch` 这样的网络请求，是一个非常典型的、也是危害性较大的副作用。因为它对外部世界（服务器）产生了明显可见的影响。

如果你希望在“个人主页被展示时”向服务器记录一次页面浏览，并且你错误地将这个时机等同于“`UserProfilePage` 函数被执行时”，那么你很可能会遇到这样的问题：即使个人主页在逻辑上只被“展示”了一次，但由于 React 可能多次执行 `UserProfilePage` 函数，导致向服务器发送了多次不必要的浏览记录请求。

![副作用的禁止标志](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/yYFz96.png)

**那么，这些必要的副作用（比如获取数据、记录日志、响应用户交互）应该放在哪里呢？** 别急，我们稍后会详细讨论 React 中处理副作用的正确姿势（剧透一下：通常是事件处理函数和 `useEffect` Hook）。现在，我们首先要牢记的是：**在组件的渲染逻辑（即函数组件的直接执行体）中，必须保持纯粹，避免任何形式的副作用。**

### “相同的输入，相同的输出”：在 React 中，“相同”到底意味着什么？

我们已经知道，纯粹性的一个核心要求是“相同的输入，总是返回相同的结果”。对于普通的 JavaScript 函数，比如一个简单的数学函数，这很容易理解：

```javascript
/** 一个简单的纯函数：将输入数字乘以10 */
function multiplyByTen(x: number): number {
  return x * 10;
}

const resultA = multiplyByTen(1); // 输入是 1
const resultB = multiplyByTen(1); // 同样的输入 1

// resultA 和 resultB 的值是相同的 (都是 10)
console.log(resultA === resultB); // 输出: true
```

但是，当我们将这个概念应用到 React 组件时，事情就变得稍微复杂一些了。因为 React 组件的返回值通常是一个 JSX 表达式，而 JSX 表达式在 JavaScript 中最终会被转换成一个**对象 (React Element)**。

考虑下面这个简单的 `Hello` 组件：

```jsx
const Hello: React.FC = () => {
  return <h1>你好，世界！</h1>;
};

// 为了方便演示，我们直接调用组件函数（这在实际开发中通常由 React 内部完成）
const jsxOutputA = Hello();
const jsxOutputB = Hello();

// 用 === 比较这两个 JSX 对象，结果会是 false！
console.log(jsxOutputA === jsxOutputB); // 输出: false
```

如果你实际去检查 `jsxOutputA` 和 `jsxOutputB` 的值（在 React 19+ 的环境下，它们是 React Element 对象），你会发现它们虽然内容看起来一样，但却是两个不同的对象引用。例如，它们可能长这样：

```json
{
  "$$typeof": Symbol(react.element), // 或者在 React 19 中是 Symbol(react.transitional.element)
  "type": "h1",
  "key": null,
  "ref": null,
  "props": { "children": "你好，世界！" },
  "_owner": null
  // ... 可能还有其他内部属性
}
```

显而易见，由于 React 组件返回的是对象，所以简单地使用 `===` 来判断“输出是否相同”是行不通的。然而，上面这个 `Hello` 组件毫无疑问是一个纯粹的组件。那么，在 React 的上下文中，当我们说“相同的输出”时，这个“相同”到底是用什么标准来衡量的呢？

结论是：**在 React 的语境下，当我们说一个纯粹的组件对于相同的输入应该返回“相同”的输出 (JSX) 时，<span className="text-red-500">我们通常指的是这个 JSX 在“语义上是相同的 (semantically the same)”或者说它代表了“相同的渲染指令</span> (same rendering instructions)”。**

这个“语义相同”听起来可能还是有点抽象，我来尝试进一步解释，希望能帮助大家更好地理解。

#### JSX 表达式：给 React 运行时的“渲染指令清单”

一个典型的 React 函数组件会返回一个 JSX 表达式，就像我们前面看到的 `Hello` 组件那样（再展示一次）：

```jsx
const Hello: React.FC = () => {
  return <h1>你好，世界！</h1>;
};
```

那么，`<h1>你好，世界！</h1>` 这个 JSX 表达式，它具体代表的是什么值呢？正如我们刚才看到的，它最终是一个描述 UI 结构的 JavaScript 对象。我们平时可能不太会直接看到或操作这个底层对象，但 React 的运行时（Runtime）接收到的正是这样的对象，并根据它来进行后续的渲染工作。

非常重要的一点是，我们要理解：**JSX 语法的本质，其实就是创建这些特定结构对象的“语法糖 (syntactic sugar)”**。它让我们能够用一种更直观、更接近 HTML 的方式来描述我们想要的 UI 结构。

因此，我们可以把一个组件返回的 JSX 表达式，看作是它向 React 运行时发出的一份“**渲染指令**”。换句话说，`Hello` 组件通过它的返回值，告诉 React 运行时：“嘿，React！如果要渲染 `Hello` 组件，你需要创建一个 `h1` 类型的 HTML 元素，并且把字符串‘你好，世界！’作为它的子内容放进去。”

以这种“指令”的视角来思考，我们就可以期望：**`如果一个组件每次都发出“语义上相同”的指令，那么 React 运行时根据这些指令所执行的渲染操作，最终也应该产生相同的用户界面。`**

所以，在 React 的上下文中，如果一个组件对于相同的输入，总是返回一个代表着“相同渲染指令”的 JSX 表达式，那么我们就可以认为这个组件是纯粹的。

在现阶段，你甚至可以这样去构建一个心智模型：判断两个 JSX 表达式是否“语义相同”，可以近似地理解为判断它们所代表的“**抽象语法树 (AST) 是否等价**”。在 `Hello` 组件的例子中，`<h1>你好，世界！</h1>` 这个 JSX 表达式所代表的树形结构是“一个名为 `h1` 的元素节点，它有一个文本子节点，内容是‘你好，世界！’”。如果组件每次都返回结构和内容完全一致的这样的“树”，那么它就是纯粹的。如果你觉得基于实现的理解比抽象的解释更容易接受，那么可以暂时用这个作为基础的心智模型。[^3]

![JSX 作为渲染指令](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/qJFLnF.png)

### 副作用的“安全区”与“禁区”：事件处理函数中的“豁免权”

正如我们前面反复强调的，为了保证组件的纯粹性，在组件的**渲染期间 (during rendering)** 绝对不能有副作用。但是，在一个真实的 React 应用中，副作用又是不可避免的——我们需要响应用户操作、获取数据、设置定时器等等。那么，这些必要的副作用应该写在哪里呢？

如果我们回到官方文档，关于副作用的“安放之处”，会找到类似这样的指导：

> 在 React 中，副作用通常属于**事件处理函数 (event handlers)** —— 当某些用户行为（比如点击按钮）发生时，由 React 调用的那些函数。尽管事件处理函数是定义在组件“内部”的，但它们并**不是在组件“渲染期间”执行的！** 这意味着，**事件处理函数不必是纯粹的。**

例如，下面这个 `LoginButton` 组件就包含了一个带有副作用的事件处理函数：

```jsx
const LoginButton: React.FC = () => {
  const handleLoginClick = () => {
    // 这里是事件处理函数的内部，可以执行副作用
    console.log("用户点击了登录按钮，准备发起登录请求...");
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username: "testuser", password: "password" }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("登录成功！");
          // ...处理登录成功的逻辑，比如页面跳转或更新全局状态...
        } else {
          console.error("登录失败！");
          // ...处理登录失败的逻辑...
        }
      })
      .catch((error) => {
        console.error("网络请求错误：", error);
        // ...处理网络错误的逻辑...
      });
  };

  return (
    <button type="button" onClick={handleLoginClick}>
      登录
    </button>
  );
};
```

在这个例子中，当用户点击“登录”按钮时，会触发 `handleLoginClick` 函数的执行，从而产生一个网络请求（这是一个典型的副作用）。这个副作用被正确地放置在了按钮 `click` 事件的事件处理函数中。换句话说，我们遵循了官方文档的规则，在事件处理函数中执行了副作用。

非常重要的一点是：**上面这个 `LoginButton` 组件，尽管其事件处理函数包含了副作用，但它本身仍然是一个完全符合 React 规则的纯粹组件！**

很多小伙伴可能会感到困惑：组件的返回值 (JSX 表达式) 中明明包含了像 `fetch` 这样的“命令式”代码，为什么这个组件还能被认为是纯粹的呢？看起来 React 组件中似乎有些地方可以写副作用，有些地方又绝对不行，这太让人糊涂了！

要理解这背后的原理，关键在于：**组件的纯粹性，指的是“计算其返回值 (JSX) 的过程”必须是无副作用的，并且对于相同输入，返回值必须“语义相同”。** 换句话说，在上面 `LoginButton` 的例子中，`handleLoginClick` 这个函数是在用户点击按钮时**才被调用执行的**，它并**不参与 `LoginButton` 组件本身返回 JSX 的那个计算过程**。因此，`handleLoginClick` 内部的副作用并不会破坏 `LoginButton` 组件作为“渲染函数”的纯粹性。

我们不妨再用之前“指令”的视角来思考一下。在这种情况下，`LoginButton` 组件向 React 运行时发出的“指令”可以解读为：“**请显示一个按钮。当这个按钮被用户点击时，请执行 `handleLoginClick` 这个函数。**” 只要我们能保证每次调用 `LoginButton` 组件时，它提供的这个 `handleLoginClick` 函数在“语义上是相同的”（即，它被调用时所执行的行为逻辑是一致的），那么无论 `LoginButton` 组件被 React 执行多少次，它返回的这份“指令”在本质上都是相同的。

为了更清晰地说明这一点，让我们稍微改写一下 `LoginButton` 组件，明确地将事件处理函数提取出来：

```jsx
const LoginButton: React.FC = () => {
  // 将事件处理函数定义为一个常量
  const handleClick = () => {
    // ...内部包含 fetch 等副作用...
    console.log("发起登录请求...");
    fetch("/api/login", { /* ... */ });
  };

  // 组件的返回值是一个描述 UI 的 JSX 对象
  // 这个 JSX 对象包含了对 handleClick 函数的引用
  return (
    <button type="button" onClick={handleClick}>
      登录
    </button>
  );
};
```

在 JavaScript 中，函数也是对象（我们称之为函数对象），而函数表达式（比如 `() => { ... }` 或者 `function() { ... }`）每次被执行时，通常会创建一个**新的**函数对象。这意味着，如果 `LoginButton` 组件（作为渲染函数）被 React 多次调用，那么在每次调用中，通过 `const handleClick = () => { ... };` 创建的 `handleClick` 都会是一个**新的、不同的函数对象引用**（就像 JSX 表达式的返回值每次都是新对象一样，它们用 `===` 比较会是 `false`）。

当 `LoginButton` 组件被执行两次时，第一次执行结果中包含的 `handleClick`（我们称之为 `handleClick1`）和第二次执行结果中包含的 `handleClick`（我们称之为 `handleClick2`），它们用 `===` 比较是不同的。但是，因为 `handleClick1` 和 `handleClick2` 的**函数体代码是完全一样的**，所以当它们分别被（在按钮点击时）调用执行时，它们所产生的**行为和效果是完全相同的**。因此，我们可以说，`handleClick1` 和 `handleClick2` 在“**语义上是相同的 (semantically the same)**”。[^4]

基于这种“语义上的相同性”，`LoginButton` 组件仍然被视为一个纯粹的组件。具体来说：

*   `LoginButton` 第一次返回的指令是：“显示一个按钮，如果被点击，执行 `handleClick1`。”
*   `LoginButton` 第二次返回的指令是：“显示一个按钮，如果被点击，执行 `handleClick2`。”

由于 `handleClick1` 和 `handleClick2` 的“语义相同”（即行为一致），所以这两条由 `LoginButton` 返回的指令最终也“语义相同”。因此，`LoginButton` 组件保持了其纯粹性。

总结一下，如果你对“有些地方能写副作用，有些地方不能”感到困惑，那么专注于“**指令的语义**”是一个非常有效的方法。如果一个组件的返回值（即它向 React 发出的 JSX“指令”）在接收到相同输入时，其“语义”总是相同的，那么这个组件就可以被认为是纯粹的。尽管“语义相同”这个概念带有一些抽象性，但它能帮助我们人类开发者在实践中判断一个 React 组件是否符合纯粹性的要求。

#### 题外话：真正做到“引用相同 (`===`)”通常是为了优化

相信很多小伙伴在开发过程中都使用过 `useMemo` 和 `useCallback` 这两个 Hooks。它们的作用，简单来说，就是帮助我们在某些情况下，确保那些在“语义上相同”的数据（对象、数组或函数），在多次渲染之间，其在 JavaScript 中的“引用也是真正相同的 (`===`)”。

例如，我们修改一下 `LoginButton` 组件，让它接收一个 `onLogin` 回调函数作为 prop，并用 `React.memo` 包裹起来，以便在接收到相同的 props 时避免不必要的重渲染：

```jsx
const LoginButton: React.FC<{ onLogin: () => void }> = React.memo(({ onLogin }) => {
  console.log("LoginButton 渲染了");
  return (
    <button type="button" onClick={onLogin}>
      登录
    </button>
  );
});
```

顺便说一句，像这样实现的 `LoginButton` 组件当然也是一个纯粹的组件。因为只要它接收到的 `onLogin` prop 在“语义上相同”，那么它返回的 JSX“指令”也会“语义相同”。

现在，我们考虑使用这个 `LoginButton` 的父组件 `App`：

```jsx
const App: React.FC = () => {
  const handleRealLogin = () => {
    // ...这里是真正的登录处理逻辑...
    console.log("执行真正的登录操作！");
  };

  // App 组件每次渲染时，都会创建一个新的 handleRealLogin 函数实例
  return <LoginButton onLogin={handleRealLogin} />;
};
```

按照目前 `App` 组件的写法，它本身仍然是一个纯粹的组件（因为它对于相同的输入——这里没有 props 或 hooks，所以总是相同输入——总是返回语义相同的 JSX）。但是，由于 `App` 每次渲染时，`handleRealLogin` 都是一个新的函数对象（引用不同），这会导致传递给 `LoginButton` 的 `onLogin` prop 每次都“看起来”是新的（即使其行为逻辑从未改变）。因此，`React.memo` <span className="text-red-500">的浅比较</span>会认为 props 发生了变化，从而导致 `LoginButton` 即使在不必要的情况下也会重新渲染。

为了充分利用 `React.memo` 的优化效果，我们通常会像下面这样，使用 `useCallback` 来包裹 `handleRealLogin`：

```jsx
import React, { useCallback } from 'react';

// LoginButton 组件定义同上 (React.memo 包裹)

const App: React.FC = () => {
  const handleRealLogin = useCallback(() => {
    // ...真正的登录处理逻辑...
    console.log("执行真正的登录操作！");
  }, []); // 依赖项数组为空，表示此回调函数永不改变

  return <LoginButton onLogin={handleRealLogin} />;
};
```

通过使用 `useCallback`，我们可以确保：只要依赖项（这里是空数组 `[]`）没有发生变化，`App` 组件在多次渲染之间，`handleRealLogin` 都会是**同一个函数对象的引用**（即用 `===` 比较结果为 `true`）。

这里使用 `useCallback` 的根本原因，是为了**迎合 React 运行时在判断 `LoginButton` 是否需要重渲染时的行为机制**。理想情况下，只要传递给 `LoginButton` 的 `onLogin` 函数在“语义上相同”，`LoginButton` 就不需要重渲染。但是，程序很难在运行时去判断两个函数是否“语义相同”。因此，React 采用了一种次优但可行的方案：通过 `===` 进行浅比较来判断 props 是否“相同”。

反过来看，`useCallback` (以及 `useMemo`) 的作用，就是帮助我们将那些“语义上相同”的函数或值，在“引用上也变成相同 (`===`)”，从而让 React 的浅比较能够正确地识别出它们并未发生实质性变化，进而跳过不必要的重渲染。

所以，非常重要的一点是：**我们使用 `useCallback` 或 `useMemo`，其主要目的并非是为了“遵守 React 的纯粹性规则”（因为即使不用它们，只要语义相同，组件仍然可以是纯粹的），而纯粹是为了进行性能优化。**

顺便提一句，我前面说“理想情况下”程序无法判断函数语义是否相同，但其实有一个东西正在试图让这个“理想”变为现实，那就是 **React Compiler**。对于不熟悉 React Compiler 的小伙伴，可以粗略地理解为它是一个“能够在构建时（编译时）智能地、自动地为你的代码插入类似 `useCallback`、`useMemo` 等优化措施的工具”。 虽然在运行时判断函数语义是否相同非常困难，但在编译时进行静态分析，在一定程度上是可以做到的。因此，当你使用 React Compiler 时，即使你没有显式地使用 `useCallback` 等 Hooks，编译器也可能会自动地将那些“语义上相同”的函数或对象，在编译后的代码中处理成“引用也相同 (`===`)”的形式。

### 组件渲染期间可以抛出异常 (Exception) 吗？

JavaScript/TypeScript 拥有一种叫做“异常 (Exception)”的语言特性。它允许我们通过 `throw` 语句抛出一个错误对象。这里，我们来思考一个问题：“**React 组件在渲染期间可以抛出异常吗？**” 换句话说，一个可能会抛出异常的组件，还能被认为是纯粹的吗？

毕竟，异常的抛出可以被视为一种“副作用”（它改变了程序的正常控制流，并且通常表示一种非预期的状态），如果这样理解，那么我们可能会得出结论：React 组件不应该在渲染期间抛出异常。

然而，对于这个问题，答案很简单：**React 组件在渲染期间是完全可以抛出异常的。** 这可以从以下两个事实得到印证：

1.  React 自身提供了一种叫做 **错误边界 (Error Boundary)** 的机制，它允许父组件捕获其子组件在渲染期间发生的 JavaScript 错误（即异常）。
2.  更直接的是，React 组件内部使用的某些 React API 本身就可能抛出异常（例如，如果你传递给 `use` Hook 的 Promise 被 reject 了）。

不过，我们可能还想探究一下，为什么 React 会做出这样的设计决策。关于“异常是否算作副作用”的通用性讨论有些过于深入，这里我们只在 React 的上下文中进行解释。

首先，在 React 中，当一个组件在渲染期间抛出异常时，它似乎被视为一种“**渲染失败 (rendering failure)**”。如果一个组件首先就抛出了异常，那么它根本就不会成功地计算出并返回那个我们期望的 JSX“指令”。在这种情况下，React 运行时就无法得知这个组件到底想要显示什么。因此，React 会转而执行失败处理流程（比如向上查找并激活最近的错误边界组件）。

更重要的是，既然组件因为异常而没有产生传统意义上的“输出”（即返回值），那么 React 也无法对其“输出”进行任何操作。在这种情况下，去讨论这个（未能成功返回 JSX 的）组件是否“纯粹”，似乎意义不大。说得更直白一点，当异常发生时，“纯粹组件所带来的益处”（比如可预测的渲染结果、可缓存性等）在 React 的行为中也无从体现了。

所以，在 React 的语境下，我们可以放心地认为：**组件在渲染期间抛出异常，并不会被视为“破坏了纯粹性”。** 它更像是一种特殊的“无输出”情况，React 有专门的机制来应对。

### 纯粹性与 React Hooks：一个容易混淆但至关重要的议题

现在，我们来到了本文最后一个，也是非常重要的一个议题。函数组件区别于传统类组件的一个显著特征就是 **Hooks** 的存在。Hooks 允许我们为函数组件赋予额外的能力，比如拥有自身的状态 (`useState`)、执行副作用 (`useEffect`) 等。然而，Hooks 的引入，也常常成为关于组件纯粹性讨论中的一个困惑来源。

#### 使用了 Hooks 会让组件变得“不纯粹”吗？

一个很自然的问题就浮现了：**使用了 React Hooks（尤其是像 `useState` 这样看起来会“改变”组件行为的 Hooks）之后，组件还能保持纯粹吗？**

例如，思考下面这个经典的计数器组件：

```jsx
import React, { useState } from 'react';

const StatefulCounter: React.FC = () => {
  // 使用了 useState Hook 来引入组件的内部状态
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数值: {count}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        点我增加计数
      </button>
    </div>
  );
};
```

如果我们机械地套用前面关于纯函数的定义，可能会认为：`StatefulCounter` 组件在每次被调用（渲染）时，`useState(0)` 似乎是从“某个地方”获取了一个 `count` 值，并且这个 `count` 值在多次渲染之间是可能变化的（因为 `setCount` 会改变它）。那么，调用 `useState` 这个“神秘的”函数，并从中获取一个可变的值，这难道不算是一种“副作用”（从外部读取状态）吗？如果 `count` 值变了，那么组件的输出（JSX）也会跟着变，这还能算是“相同的输入，相同的输出”吗？

然而，事实是：**在 React 的世界里，像上面 `StatefulCounter` 这样的组件，仍然被认为是完全纯粹的！**

这正是“在 React 语境下理解纯粹性”的一个非常特殊的、也是至关重要的方面。通俗地讲，虽然从广义的函数式编程角度看，调用像 `useState` 这样会与外部“React 运行时”进行交互并获取状态的 Hooks，可能确实可以被解读为一种副作用，但是，**在 React 的规则体系内，正确地使用 React 官方提供的 Hooks 并不会破坏组件的纯粹性。** 我在文章开头就提到，我们需要根据 React 的上下文来调整纯粹性的定义，这很大程度上就是因为 Hooks 的存在。

结论就是：<span className="text-red-500">在 React 中，我们必须将 Hooks 的返回值，也视为组件的“输入 (inputs)”的一部分。</span>

以这种方式来思考，我们就可以得出结论：上面那个 `StatefulCounter` 组件是纯粹的。`StatefulCounter` 的输出（它返回的 JSX 表达式）中包含了 `count` 和 `setCount` 这两个值，而它们都是 `useState` 这个 Hook 的返回值。如果我们将 `count` 和 `setCount` (以及组件接收的 props，虽然这个例子中没有) 都看作是 `StatefulCounter` 组件在某一次渲染时的“输入”，那么对于这组“输入”，`StatefulCounter` 组件总是会返回一个结构确定、语义相同的 JSX 输出。因此，它满足了纯粹性的要求。

总结一下，当我们讨论 React 组件的纯粹性时，一个组件的“**总输入 (total inputs)**”应该包括：

1.  **组件的参数 (props)**
2.  **组件内部调用的所有 Hooks 的返回值**

在前面的例子中，props 可能没有扮演太重要的角色，所以这里我们再看一个同时使用了 props 和 Hooks 返回值的组件示例：

```jsx
import React, { useState } from 'react';

// 这个组件接收一个名为 unit 的 prop，并使用 useState 管理内部的 count 状态
const ConfigurableCounter: React.FC<{ initialCount?: number; unit: string }> = ({ initialCount = 0, unit }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>当前数量: {count} {unit}</p>
      <button type="button" onClick={() => setCount(prevCount => prevCount + 1)}>
        增加一个{unit}
      </button>
    </div>
  );
};
```

这个 `ConfigurableCounter` 组件：

*   接收 `initialCount` (可选) 和 `unit` 作为 props。
*   使用 `useState` Hook，并从中获取 `count` (当前计数值) 和 `setCount` (更新计数值的函数)。

在某一次特定的渲染中，`initialCount`、`unit`、`count` 和 `setCount` 这些值共同构成了 `ConfigurableCounter` 组件的“总输入”。对于这组确定的“总输入”，`ConfigurableCounter` 组件总是会返回一个语义上完全相同的 JSX 结构。因此，这个组件也是纯粹的。

#### 对 Hooks 返回值作为“输入”的进一步思考

React 这种“将 Hooks 的返回值也视为组件输入”的观点，乍一看可能与传统函数式编程中对纯函数的理解有些出入。因此，有些小伙伴可能在这里仍然会感到一丝不适或困惑。所以，让我们再深入一步，尝试从另一个角度来理解 Hooks 和纯粹性之间的关系。

Hooks 为组件提供了多种至关重要的能力，但其中最核心的一项就是**为组件提供了一个“状态存储区 (storage area)”**。通过使用像 `useState` 和 `useReducer` 这样的 Hooks，组件就能够拥有自己的、可以在多次渲染之间保持的内部状态。这些状态实际上是存储在由 React 运行时管理的、与特定组件实例相关联的“存储区”中的。其他一些 Hooks，比如 `useMemo`、`useCallback` 和 `useRef`，也在某种程度上利用了这个组件级别的“存储区”。

基于“组件存储区”这个概念，我们可以这样来理解：**一个组件在某一次渲染时的“总输入”，实际上是该组件当前的 props 和其内部“存储区”在那个特定时间点的一个“快照 (snapshot)”。**[^6] 这意味着，对于一个确定的 props 状态和“存储区快照”，一个纯粹的组件应该总是返回相同的 JSX 输出。

具体到 `useState`，我们之所以需要通过调用 `useState(initialValue)` 来获取 `count` 这个状态，正是因为我们必须通过 React 提供的这个 API 去从组件的“存储区”中读取它。如果 React 的 API 设计走了另一条路，我们可能最终会得到一个看起来更像下面这样的 API（这纯粹是为了帮助理解，并非真实的 React API）：[^7]

```javascript
// --- 一个平行宇宙中的 React API 猜想 ---
// (这个组件定义只是为了说明概念，请勿在实际项目中使用)
const CounterInAnotherUniverse: React.FC<{ unit: string }> = (
  props,       // 组件的 props
  memory,      // 代表组件内部状态存储的一个对象
  updateMemory // 一个用于更新内部状态存储的函数
) => {
  const { unit } = props;
  const count = memory.count || 0; // 从 "memory" 中读取 count 状态

  return (
    <div>
      <p>数量: {count} {unit}</p>
      <button type="button" onClick={() => {
        // 通过 "updateMemory" 函数来更新 "memory" 中的 count 状态
        updateMemory({ count: count + 1 });
      }}>
        增加
      </button>
    </div>
  );
};
// --- 平行宇宙结束 ---
```

如果 React 采用了类似上面这样的 API 设计，那么我们很自然地就会将“组件 `memory` 的快照”视为组件输入的一部分。实际上，React 采用的 Hooks API，其本质也是让组件能够使用类似这样的“内存快照”作为输入。因此，我们必须基于这个前提来思考组件的纯粹性。

至于 React 为什么最终选择了 Hooks 这种 API 形式，而不是上面那种更显式的“内存传递”方式，这超出了本文的讨论范围。但可以推测，Hooks 这种设计能够带来更好的组件逻辑内聚性、更灵活的自定义 Hooks 能力等诸多优势。

#### Hooks 内部代码的纯粹性要求：`useMemo` vs `useEffect`

关于“副作用可以写在哪里，不可以写在哪里”的规则，到目前为止我们知道了：

1.  计算组件返回值 (JSX) 的**渲染逻辑本身**，必须无副作用。
2.  定义在 JSX 中的**事件处理函数内部**，可以包含副作用。

随着 Hooks 概念的引入，一个新的问题又出现了：“**我可以在 Hooks 的内部（比如传递给 Hooks 的回调函数中）编写副作用吗？**” 答案是：**这取决于具体是哪个 Hook。**

简单来说，**你不应该在 `useMemo` 的回调函数中编写副作用。** 如果你理解了 `useMemo` 的主要目的是用于渲染优化（即“记住”一个值的计算结果，避免在每次渲染时不必要的重复计算），那么这一点就很容易理解了。

思考下面的优化前后的 `Counter` 组件：

```jsx
// --- 优化前 ---
const CounterBeforeMemo: React.FC<{ unit: string }> = ({ unit }) => {
  const [count, setCount] = useState(0);

  // 假设这个格式化操作比较耗时
  const formatter = new Intl.NumberFormat("ja-JP"); // 每次渲染都创建一个新的 formatter 实例
  const countString = formatter.format(count);     // 每次渲染都执行格式化

  return (
    <div>
      <p>计数: {countString} {unit}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
};

// --- 使用 useMemo 优化后 ---
import React, { useState, useMemo } from 'react';

const CounterAfterMemo: React.FC<{ unit: string }> = ({ unit }) => {
  const [count, setCount] = useState(0);

  // 使用 useMemo 来缓存 countString 的计算结果
  // 只有当 count 发生变化时，useMemo 的回调函数才会重新执行
  const countString = useMemo(() => {
    console.log("useMemo 回调执行：正在格式化 count...");
    const formatter = new Intl.NumberFormat("ja-JP");
    return formatter.format(count); // 这个计算过程本身应该是纯粹的
  }, [count]); // 依赖项数组

  return (
    <div>
      <p>计数: {countString} {unit}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
};
```

换句话说，**`useMemo` 的回调函数中所执行的代码，实际上是组件返回值计算过程的一部分。** 因此，如果 `useMemo` 的回调函数中包含了副作用，那么组件返回值的计算过程也就间接包含了副作用，这就违反了纯粹性的要求。所以，请确保传递给 `useMemo` 的计算函数是纯粹的。`useCallback` 同理，传递给它的回调函数也应该是为了返回一个语义上稳定的函数引用，其定义过程不应有副作用。

作为另一个例子，**在 `useEffect` 的回调函数内部编写副作用是完全合法的，甚至是 `useEffect` 的主要用途。** 例如，在下面的 `useEffect` 用法中，其回调函数内部就执行了一个副作用——向 `document` 注册了一个滚动事件的监听器：

```javascript
import React, { useEffect, useState } from 'react';

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // useEffect 的回调函数，在组件挂载后执行
    console.log("useEffect 执行：添加滚动事件监听器");
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // 副作用：向 document 添加事件监听器
    document.addEventListener("scroll", handleScroll, { passive: true });

    // 清理函数：在组件卸载前执行，用于移除事件监听器
    return () => {
      console.log("useEffect 清理函数执行：移除滚动事件监听器");
      document.removeEventListener("scroll", handleScroll);
    };
  }, []); // 空依赖数组，表示此 effect 只在组件挂载和卸载时执行一次

  return <p>当前页面滚动位置: {scrollY}px</p>;
}
```

为什么可以在 `useEffect` 的回调中编写副作用呢？因为 `useEffect` 的回调函数并**不直接参与组件返回 JSX 的那个计算过程**。`useEffect` 中定义的代码，是在 React 完成了对组件的渲染、并将渲染结果提交到 DOM **之后**，才会被异步执行的。

所以，更准确地说，`useEffect` 中定义的代码，是组件向 React 发出的另一类“指令”的一部分：“**当这个组件成功挂载（或其依赖项发生变化）之后，请执行这个‘效果 (effect)’函数。**” 如果我们把这个“效果”函数本身，也看作是像事件处理函数那样的一个“待执行的逻辑包”，那么只要这个“逻辑包”在语义上是稳定的，它内部包含副作用并不会影响到组件渲染过程的纯粹性。

（*关于 `useEffect` 的详细用法和各种令人困惑的场景，本身就是一个很大的话题，这里就不再深入展开了，以免喧宾夺主。*）

![Hooks 与副作用的关系图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/dGtBFq.png)

### 总结：拥抱纯粹性，构建更健壮的 React 应用

在这篇稍显冗长的文章中，我们从多个角度深入探讨了 React 组件纯粹性的含义、重要性以及如何在实践中理解和应用它。让我们再次回顾一下核心的要点：

1.  **核心原则**：React 组件（在作为渲染函数时）应该努力成为**纯函数**——对于相同的“总输入”，总是返回“语义相同”的 JSX 输出。
2.  **“总输入”的构成**：在 React 中，一个组件的“总输入”不仅包括它接收到的 **props**，还包括它内部调用的所有 **Hooks 的返回值**。
3.  **“语义相同”的输出**：指的是组件返回的 JSX 表达式所代表的“渲染指令”在意义上是相同的，而不是指 JavaScript 对象的引用 (`===`) 相同。
4.  **纯粹性即“渲染期间无副作用”**：也可以从“副作用”的角度来理解纯粹性。这意味着在计算 React 组件返回值 (JSX) 的**整个渲染过程中，不应该包含任何副作用**（如修改外部变量、直接读写 DOM、发起网络请求、不稳定的随机行为等）。
5.  **事件处理函数的“豁免权”**：定义在 JSX 元素上的事件处理函数（如 `onClick`）虽然可能包含副作用，但由于这些副作用并**不在组件返回值计算期间执行**，而是由用户交互触发，因此它们并不会破坏组件的纯粹性。
6.  **Hooks 内部的副作用规则**：
    *   像 `useMemo` 和 `useCallback` 这样用于优化渲染性能的 Hooks，其传递的回调函数**不应该包含副作用**，因为这些回调函数的执行结果直接参与了组件返回值的计算。
    *   而像 `useEffect` 这样专门用于处理副作用的 Hook，其回调函数则**可以（也通常应该）包含副作用**，因为这些回调函数是在组件渲染完成之后才被执行的。
7.  **异常处理**：组件在渲染期间抛出异常，在 React 中被视为“渲染失败”，并有相应的错误边界机制处理，这并**不等同于“破坏了纯粹性”**。

文章中我尝试通过不同的角度和例子来阐释 React 组件的纯粹性，希望能让尽可能多的开发者伙伴们，哪怕只是其中的某一个解释或比喻，能够让你豁然开朗。我知道，对于某些已经非常熟悉这些概念的开发者来说，文中的一些解释可能显得有些啰嗦，但考虑到本文的初衷是尽可能细致地普及这个核心概念，还请多多包涵。

深刻理解并严格遵守组件的纯粹性原则，是我们编写出高质量、高可维护性、高性能且能够从容拥抱 React 未来发展的 React 应用的基石。希望这篇文章能对大家有所帮助！

---

## 参考资料

- [React 官方文档 - Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [React 官方文档 - Thinking in React](https://react.dev/learn/thinking-in-react)
- [React 官方文档 - Hooks](https://react.dev/reference/react)
- [React 官方文档 - Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [React 官方文档 - Memoization](https://react.dev/reference/react/useMemo)
- [React 官方文档 - useEffect](https://react.dev/reference/react/useEffect)
