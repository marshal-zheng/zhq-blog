---
author: ZHQ
pubDatetime: 2024-03-12T11:00:00+08:00
title: '聊聊 React 中的 useEffect'
featured: false
draft: false
tags:
  - 'React'
description: '聊聊 React 中的 useEffect：什么时候你可能真的不需要它'
---

最近在Code Review 自己写代码的时候，发现 `useEffect` 这个 Hook 的使用频率相当高，有时候甚至感觉有点被“滥用”了。这让我想起 React 官方文档其实一直也在强调一个观点：**尽可能少地使用 `useEffect`**。这么做，不仅能让咱们的代码读起来更顺畅，跑起来更快，还能在一定程度上减少一些奇奇怪怪的 bug。

所以，今天就想结合官方文档的建议和自己的一些实践体会，跟大家伙儿一块儿探讨一下，到底在哪些常见的场景下，咱们其实可以优雅地绕开 `useEffect`，让代码写得更“React”一些。

## 场景一：为渲染而进行的数据转换，真的需要 `useEffect` 吗？

官方文档指出的第一种不太需要副作用（effect）介入的情况，就是**为渲染而进行的数据转换**。说白了，就是咱们为了在界面上把数据展示成想要的样子，而对原始数据进行的一些筛选、排序、格式化等加工处理。

很多开发者（包括我自己以前也经常这么干）可能会下意识地想到用 `useEffect` 来监听数据的变化，然后把处理后的结果存到一个新的 state 里面。比如下面这个例子，我们想根据搜索条件来过滤用户列表：

**一个可能不太理想的尝试：用 `useEffect` 存过滤结果**

```jsx
import { useEffect, useState } from 'react';

function UserList({ users, searchQuery }) {
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // 在 useEffect 中根据 users 或 searchQuery 的变化来过滤数据
    const result = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // 将过滤结果更新到 filteredUsers state 中
    setFilteredUsers(result);
  }, [users, searchQuery]); // 依赖项数组

  return (
    <ul>
      {filteredUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

乍一看，这段代码好像没什么问题，也能正常工作。但仔细琢磨一下，这里面其实暗藏玄机：

*   **不必要的 State 和重复渲染**：我们引入了一个额外的 `filteredUsers` 状态。当 `users` 或 `searchQuery` 变化时，`useEffect` 触发，调用 `setFilteredUsers`，这会导致组件重新渲染。但实际上，这个过滤操作完全可以在渲染过程中直接完成。
*   **潜在的性能陷阱**：这种模式很容易形成 React 中一种不太理想的“渲染 → DOM 更新 → 副作用触发 → 状态再次更新 → 引发又一次渲染”的循环。虽然在这个简单例子中可能不明显，但在更复杂的组件中，这种额外的渲染周期可能会累积起来，影响性能。

**一个更“React”的思路：在渲染过程中直接计算**

```jsx
function UserList({ users, searchQuery }) {
  // 直接在渲染函数内部，根据当前的 props 计算出需要展示的数据
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 如果这个计算量非常大，还可以考虑用 useMemo 来进行优化
  // const filteredUsers = useMemo(() => {
  //   return users.filter(user =>
  //     user.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // }, [users, searchQuery]);

  return (
    <ul>
      {filteredUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

![数据转换流程对比图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/YUuWhG.png)

这样做的好处显而易见：

*   **代码更简洁，移除了副作用**：我们不再需要 `useEffect` 和那个额外的 `filteredUsers` 状态了。
*   **逻辑更自然，自动更新**：每当 `users` prop 或 `searchQuery` prop 发生变化时，组件会自然地重新渲染，`filteredUsers` 这个常量也会在渲染过程中被自动重新计算。
*   **更符合 React 的数据流，也更高效**：这种方式完全顺应了 React 从 props 和 state 到 UI 的单向数据流思想，避免了不必要的副作用和渲染周期。

坦白说，关于“每当 props 或 state 变化时，渲染函数会自动重新执行并重新计算派生值”这一点，我自己也是在最近一段时间才真正深刻理解到，原来很多情况下真的不需要通过 `useEffect` 去“手动”触发更新，结果之前也写过不少类似上面那种反模式的代码。

## 场景二：处理用户事件，`useEffect` 可能也不是首选

官方文档指出的第二种通常不需要副作用的情况，是**用户事件的处理**。很多开发者（这里可能也带有一些习惯性的偏见）在处理用户交互时，可能会下意识地想："用户点击了按钮之后，我应该用 `useEffect` 来监听某个状态的变化，然后做一些事情"。但实际上，大多数用户事件的处理逻辑，都应该直接在相应的事件处理器函数中进行。

正如 [React 官方文档所指出的](https://react.dev/learn/you-might-not-need-an-effect#responding-to-events)："如果某段代码是为了响应特定的用户交互而执行的，那么这段代码应该放在事件处理器中，而不是 `useEffect` 里"。

**一个可能有点绕的尝试：用 `useEffect` 响应按钮点击**

```jsx
import { useEffect, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  // 用一个额外的 state 来标记按钮是否被点击
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // 当 clicked 状态变为 true 时，执行真正的计数逻辑
    if (clicked) {
      setCount(c => c + 1);
      // 处理完之后，重置 clicked 状态，避免下次重复触发
      setClicked(false);
    }
  }, [clicked]); // 依赖于 clicked 状态

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setClicked(true)}>Increment</button>
    </div>
  );
}
```

这段代码给人的第一印象，可能就是处理方式有点过于繁琐和间接了：

*   **引入了不必要的中间状态**：用户点击按钮这个动作，本身已经是一个明确的事件了，但这里却仅仅用它来设置了一个 `clicked` 的标志位。
*   **核心逻辑放在了副作用中**：真正的 `count` 状态的更新，却被放到了 `useEffect` 这个副作用钩子中去执行。
*   **`clicked` 状态的作用不够明确**：对于阅读代码的人来说，可能需要多琢磨一下，才能明白 `clicked` 这个状态在这里到底起到了什么作用。

**一个更直接、更清晰的思路：在事件处理器中直接更新状态**

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // 将状态更新逻辑直接放在事件处理器中
  const handleIncrement = () => {
    setCount(c => c + 1);
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleIncrement}>Increment</button>
      {/* 或者更简洁地直接写成 onClick={() => setCount(c => c + 1)} */}
    </div>
  );
}
```

![事件处理流程对比图](https://via.placeholder.com/800x300.png?text=Event+Handling:+useEffect+vs+Direct+Handler)

这样做的好处同样非常明显：

*   **逻辑直接明了**：用户点击按钮这个事件，直接触发了 `setCount()` 这个状态更新函数。
*   **状态立即反映，代码简洁易读**：状态的更新是即时的，整个组件的代码也变得更加简洁和易于理解。
*   **完全无需使用 `useEffect`**：我们成功地避免了不必要的副作用引入。

这段代码读起来就非常顺畅自然了。在实际开发中，我们通常会创建一个像 `handleClick`、`handleSubmit` 这样的事件处理函数，然后将它直接传递给像 `onClick`、`onSubmit` 这样的事件属性。

## 那么，到底什么时候才真正需要 `useEffect` 呢？

聊了这么多“不需要”的场景，那到底在哪些情况下，`useEffect` 才是那个不可或缺的、能够帮我们解决问题的“英雄”呢？React 官方文档给出了一个非常核心的指导原则：

<span className="text-red-500">当你的组件需要与 React 组件树之外的“外部系统”进行同步或交互时，你就需要使用副作用（`useEffect`）。</span>

这里的“外部系统”是一个比较宽泛的概念，它可以指浏览器 <span className="text-red-500">API、第三方库、网络请求</span>，甚至是手写的原生 JavaScript 代码等等。简单来说，`useEffect` 就是咱们 React 组件与它自身渲染流程之外的“外部世界”进行沟通和同步的桥梁。

下面是一些典型的、确实需要使用 `useEffect` 的具体场景示例：

1.  **与外部的、非 React 的 UI 库（例如 jQuery 小部件）进行同步**
    想象一下，你需要在你的 React 应用中使用一个经典的 jQuery UI 的日期选择器 (datepicker) 小部件。由于这个小部件并不是由 React 来管理的，你需要通过 `useEffect` 来在 React 组件挂载后初始化它，并在组件卸载前销毁它，同时还要确保 React 的状态能够与这个外部小部件的状态保持同步。

    ```jsx
    import { useEffect, useRef } from 'react';
    import $ from 'jquery'; // 引入 jQuery
    import 'jquery-ui/ui/widgets/datepicker'; // 引入 jQuery UI datepicker

    function DatePicker({ value, onChange }) {
      const inputRef = useRef(); // 用于获取 input DOM 元素的引用

      useEffect(() => {
        const $input = $(inputRef.current);
        // 初始化 jQuery UI datepicker
        $input.datepicker({
          onSelect: date => onChange(date), // 当用户选择日期时，调用 React 的 onChange 更新状态
        });

        // 清理函数：当组件卸载时，销毁 datepicker 实例，防止内存泄漏
        return () => $input.datepicker('destroy');
      }, []); // 空依赖数组，表示这个 effect 只在组件挂载和卸载时运行一次

      // 注意：在 useEffect 中，通常不直接修改由 React 管理的 DOM（比如这里的 defaultValue）
      // defaultValue 应该由 React 的渲染流程来控制
      // 如果需要在 value prop 变化时更新 datepicker，则需要将 value 加入依赖项，并在 effect 内部调用 $input.datepicker('setDate', value)
      return <input ref={inputRef} defaultValue={value} />;
    }
    ```

2.  **进行异步数据获取（例如，与后端 API 进行同步）**
    这是一个非常常见的场景。当组件需要根据某些条件（比如用户的搜索查询）从后端 API 获取数据时，`useEffect` 就派上用场了。

    ```jsx
    import { useState, useEffect } from 'react';

    function SearchBox() {
      const [query, setQuery] = useState('');
      const [results, setResults] = useState([]);

      useEffect(() => {
        // 如果查询为空，则不执行任何操作
        if (!query) {
          setResults([]); // 可以选择清空结果
          return;
        }

        // 创建一个 AbortController，用于在组件卸载或查询变化时取消上一次的网络请求
        const controller = new AbortController();

        fetch(`/api/search?q=${query}`, { signal: controller.signal })
          .then(res => res.json())
          .then(data => setResults(data))
          .catch(error => {
            if (error.name === 'AbortError') {
              console.log('Fetch aborted');
            } else {
              console.error('Fetch error:', error);
            }
          });

        // 清理函数：当 query 发生变化，或者组件卸载时，取消当前正在进行的 fetch 请求
        return () => controller.abort();
      }, [query]); // 依赖于 query 状态，当 query 变化时，重新执行 effect

      return (
        <>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索..." />
          <ul>
            {results.map(item => <li key={item.id}>{item.title}</li>)}
          </ul>
        </>
      );
    }
    ```
    在这个例子中，`useEffect` 确保了只有当 `query` 发生变化时，才会去触发 API 请求。并且，通过返回一个清理函数，我们还能够处理在新的请求发起前取消上一个未完成的请求，避免潜在的竞态条件。

3.  **注册和清理 DOM 的事件监听器（例如，监视页面的滚动位置）**
    当你的组件需要响应一些浏览器原生的 DOM 事件（比如窗口滚动、鼠标移动等）时，你也需要在 `useEffect` 中去注册这些事件监听器，并且非常重要的一点是，在组件卸载时，务必记得移除这些监听器，以防止内存泄漏。

    ```jsx
    import { useEffect, useState } from 'react';

    function ScrollTracker() {
      const [scrollY, setScrollY] = useState(window.scrollY);

      useEffect(() => {
        const handleScroll = () => {
          console.log('当前滚动位置:', window.scrollY);
          setScrollY(window.scrollY); // 如果需要在组件内使用滚动位置，则更新 state
        };

        // 在组件挂载后，添加 scroll 事件监听器
        window.addEventListener('scroll', handleScroll);

        // 清理函数：当组件卸载时，移除 scroll 事件监听器
        return () => window.removeEventListener('scroll', handleScroll);
      }, []); // 空依赖数组，表示这个 effect 只在组件挂载和卸载时运行一次

      return <p>当前垂直滚动距离: {scrollY}px</p>;
    }
    ```

仔细观察上面这三个典型的、确实需要使用 `useEffect` 的示例，我们可以发现它们的一些共同点：

*   **与外部的、非 React 管理的 UI 库进行同步**（比如 jQuery 小部件）。
*   **与外部的、异步的 API 服务进行数据同步**（比如 fetch 数据）。
*   **与浏览器原生的 DOM API 进行交互和同步**（比如添加和移除事件监听器）。

这些场景都涉及到在 React 的组件渲染流程之外，与“外部世界”进行某种形式的交互或状态同步。这正是 `useEffect` 这个 Hook 被设计出来要解决的核心问题。

## 总结一下

在 React 的世界里，`useEffect` 无疑是一个非常强大且灵活的工具，但“能力越大，责任越大”，合理地使用它至关重要。它应该被主要用于处理那些需要你的组件与“外部世界”（即 React 组件树和其单向数据流之外的系统）进行交互或同步的场景。

如果你的需求仅仅是为了在渲染时对数据进行一些转换和加工，或者只是为了响应用户的某个简单事件来更新组件的内部状态，那么通常情况下，你是不需要动用 `useEffect` 这个“大炮”的。直接在渲染函数内部进行计算，或者在事件处理器函数中直接更新状态，往往会是更简洁、更高效、也更符合 React 设计理念的做法。

通过更精准地理解和使用 `useEffect`，我们不仅能够写出更易于阅读和维护的代码，还能够有效地提升应用的性能，并减少一些不必要的、难以排查的错误的发生。希望今天的分享，能对大家在日常的 React 开发中，更好地驾驭 `useEffect` 这个强大的 Hook 有所启发和帮助。