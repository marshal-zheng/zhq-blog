---
author: ZHQ
pubDatetime: 2023-01-03T21:10:34.000+08:00
title: 'React实现一个 Draggable 组件的全过程'
featured: false
draft: false
slug: 'react-draggable'
tags:
  - 'react'
description: '本文从零开始，详细介绍如何用 React 实现一个可拖拽组件，包括核心原理、性能优化、边界处理等关键技术点的深入讲解。'
---

最近在做拖拉拽相关的需求，在这里记录一下看似简单却很有趣的功能——用 React 实现一个 **Draggable 组件**。拖拽功能在很多场景下都非常实用，比如布局调整、拖拽排序，甚至是文件拖放上传。虽然市面上有许多现成的组件库可以直接使用，但自己动手实现一遍，不仅能更深入理解底层逻辑，还能更灵活地应对个性化需求。

所以，在这篇文章里，我将和大家从零开始，用 React 实现一个基础的 Draggable 组件。主要探讨核心逻辑、性能优化，以及如何一步步提升组件的扩展性和用户体验。

<a target="blank" href="https://codesandbox.io/p/devbox/vite-react-ts-forked-ng4gfl?file=%2Fsrc%2FApp.scss%3A10%2C1-23%2C2" class="hover:text-red-500">点这里查看代码和运行效果</a> <span class="text-red-500">（点击可直接跳转到 CodeSandbox）</span>。接下来的内容中，我会一步步拆解实现过程，探索核心逻辑、性能优化的思路，以及如何提升组件的扩展性。

## 为什么要实现一个 Draggable 组件？

再动手之前, 我们先聊一聊‘为什么有要手动实现一个Draggable组件的想法?’, 实际业务开发中拖拽交互在前端开发中是常见需求，无论是调整布局还是拖拽排序，都可以通过一个基础的 Draggable 组件实现。比如，在构建一个可自定义的 Dashboard 时，用户需要自由拖动面板来调整布局；或者在构建任务管理工具（如 Trello）时，需要拖拽卡片改变顺序；甚至在文件上传功能中，拖拽文件到指定区域也是一种常见的交互模式。可以说，拖拽的实现直接影响了用户体验的流畅性。

尽管市面上有很多现成的库（比如 `react-draggable` 或 `react-beautiful-dnd`, 倾向与Vue3的小伙伴可以在文章最底下找到我基于vue3开源的vue-draggable项目地址），但手动实现一个 Draggable 组件依然有很大的价值。首先，它可以帮助我们深入理解拖拽功能的核心原理，从鼠标事件的监听到 DOM 的实时更新，再到状态管理的优化，每一步都能让我们更透彻地掌握这一功能背后的逻辑。其次，手写实现更加轻量化，可以避免引入多余的依赖。最后，在一些特定场景中，手动实现能更灵活地满足项目需求，比如动态限制拖拽范围或自定义视觉效果。

本文的目标是带领大家从零开始实现一个基础的 Draggable 组件，通过剖析实现步骤与关键逻辑，帮助你在项目中灵活应用这一技术。接下来，我们将从拖拽的核心原理入手，逐步拆解实现过程。

## 在实现之前：你需要了解的拖拽基础知识

在开始实现 Draggable 组件之前，我们先来看看一些核心概念和技术点。这些知识不仅是实现拖拽交互的基础，

#### **1. transform 属性与位移操作**

`transform` 是一个高效操作元素位置的 CSS 属性。相比直接修改 `top` 和 `left`，`transform` 的性能更好，因为它不会触发浏览器的重新布局（Reflow），而是利用 GPU 加速完成位移渲染。

在 Draggable 中，我们会通过 transform: translate(x, y) 来动态调整元素的位置。例如：

    transform: translate(100px, 200px);

这表示将元素在 X 轴方向移动 100 像素，在 Y 轴方向移动 200 像素。这种方式不仅流畅，还能避免拖拽过程中的卡顿问题。

#### **2. 拖拽的三大核心事件**

拖拽的实现主要依赖三个鼠标事件，它们分别对应拖拽的三个阶段：

*   **mousedown（鼠标按下）** ：用于检测拖拽的起点，并记录当前鼠标和元素的初始位置。
*   **mousemove（鼠标移动）** ：在鼠标移动时触发，用于实时计算偏移量并更新元素的位置。
*   **mouseup（鼠标松开）** ：标志拖拽结束，清理相关事件监听，保存最终状态。

这三个事件结合起来，形成了一个完整的拖拽流程：

1.  按下鼠标时初始化拖拽状态。
2.  移动鼠标时不断计算位移并更新 UI。
3.  松开鼠标时终止拖拽并保存最终位置。

#### **3. 鼠标坐标与偏移量计算**

在拖拽过程中，需要精确计算鼠标的移动距离。通过事件对象（`MouseEvent`），我们可以获取当前鼠标在页面中的坐标：

*   `e.clientX` 和 `e.clientY`：分别表示鼠标在 X 和 Y 轴的当前位置。

利用鼠标的当前位置与初始位置，可以计算出鼠标的偏移量：

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

然后，将这个偏移量加到元素的初始位置上，得出新的位置。

## 拖拽的核心原理与设计思路

要实现一个基础的 Draggable 组件，首先我们需要理解拖拽交互背后的核心原理。简单来说，拖拽的过程可以分为三个关键步骤：开始拖拽、拖拽中、结束拖拽。每一步都由特定的事件驱动，密切配合以完成整个交互流程。

在用户按下鼠标时（`mousedown`），需要记录下鼠标的初始位置（`startX` 和 `startY`），以及元素的初始位置。这些数据为后续的拖拽计算奠定了基础。接着，当用户移动鼠标（`mousemove`）时，通过计算鼠标当前位置与初始位置的差值（`deltaX` 和 `deltaY`），来实时更新元素的位置，产生拖拽的视觉效果。最后，当鼠标释放（`mouseup`）时，清理相关的事件监听，标记拖拽操作结束，同时保存最终位置。

在 React 中，状态管理起到了关键作用。这里可以使用 `useState` 来存储拖拽过程中的位置信息，例如当前的坐标值。同时，结合 `useRef` 保存鼠标的初始位置，可以避免因频繁更新状态而触发的多余渲染。这样不仅确保了性能，还使得代码结构清晰易懂。

拖拽交互的性能优化同样重要。在拖拽过程中，鼠标移动的事件触发频率极高，如果直接触发组件的重绘，会导致明显的卡顿。为了解决这个问题，可以使用 `requestAnimationFrame` 控制更新频率，或通过防抖和节流的方式降低计算的开销。

整体看，拖拽的实现并不复杂，核心点在于如何高效地处理事件并更新界面。下面将通过代码一步步展示这些概念在实际开发中的具体应用。

## 实现 Draggable 组件的具体步骤

在了解了拖拽的基础知识后，下面我来实现一个简单的 Draggable 组件。以下是具体的实现步骤，将逐步完成组件的功能，确保每一部分逻辑清晰易懂。为了能更容易的实践, 这里可以使用<a href="https://codesandbox.io/p/sandbox/vite-react-ts-sd7bp" target="_blank" rel="noopener">Codesandbox</a>在线的代码编辑器来快速编程; 好下面开始实践

#### **第一步：初始化项目**

首先，打开 <a href="https://codesandbox.io/p/sandbox/vite-react-ts-sd7bp" target="_blank" rel="noopener">Codesandbox</a> 并创建一个 Draggable.tsx组件, 并在App.tsx中导入组件`import Draggable from './Draggable'`

    import React, { useState } from 'react';
    import './App.scss';

    import Draggable from './Draggable';

    function App() {
      return (
        <div className="App">
          <Draggable>I can be dragged anywhere</Draggable>
        </div>
      );
    }

    export default App;

#### **第二步：创建 Draggable 组件**

在 `Draggable.tsx` 中，先写一个简单的组件框架。这里暂时只做一件事：让它渲染传递的子元素，并设置基本的样式和事件

    import React from "react";

    const Draggable = ({ children }) => {
      return (
        <div
          style={{
            position: "absolute",
            cursor: "grab"
          }}
        >
          {children}
        </div>
      );
    };

    export default Draggable;

在`App.css`中添加如下样式

    .react-draggable {
      cursor: move;
      background: #ccc;
      border: 1px solid black;
      border-radius: 3px;
      width: 100px;
      height: 100px;
      padding: 10px;
      display: flex;
      align-items: center;
      &::selection {
        background: transparent;
      }
    }

> 👉 **运行看看效果**：你会发现页面中显示了一个“I can be dragged anywhere”的块，但它现在并不能拖动。别急，接下来会添加事件，让它动起来。

#### **第三步：添加基础拖拽事件**

要让元素可以拖动，我们需要处理鼠标事件。这里可分三步：

1.  **按下鼠标时（** `mousedown` **）记录鼠标起点位置。**
2.  **移动鼠标时（** `mousemove` **）计算位置变化，并更新元素位置。**
3.  **松开鼠标时（** `mouseup` **）结束拖拽。**

这里先来实现按下和移动事件。修改 `Draggable.tsx`：

    import React, { useState } from 'react';

    const Draggable = ({ children }: { children: React.ReactNode }) => {
      const handleMouseDown = (e: React.MouseEvent) => {
        console.log('Mouse Down:', e.clientX, e.clientY);
      };

      const handleMouseMove = (e: React.MouseEvent) => {
        console.log('Mouse Move:', e.clientX, e.clientY);
      };
      const handleMouseUp = (e: React.MouseEvent) => {
        console.log('Mouse Up');
      };
      return (
        <div
          className="react-draggable"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {children}
        </div>
      );
    };

    export default Draggable;

上面添加了 `onMouseDown`、`onMouseMove` 和 `onMouseUp` 三个监听事件，用于识别拖拽的开始、进行中和结束状态。从 Console 中可以看到事件监听已经生效，但这里存在一个问题：功能上希望只有在鼠标按下时才开始执行 `move` 操作。

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/d6b032a0e87b4ea1a666290a2285c44a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740197798&x-orig-sign=P2xPazhReAb5T3W%2BaSPBme6PmuI%3D)

这里可以通过添加一个 `isDragging` 标志来解决问题。在 `onMouseDown` 中将 `isDragging` 设置为 `true`，在 `onMouseUp` 中将其设置为 `false`，从而控制拖拽逻辑的启停;优化后的代码如下:

    import React, { useState } from 'react';

    const Draggable = ({ children }: { children: React.ReactNode }) => {
      const [isDragging, setIsDragging] = useState(false);

      const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        console.log('Mouse Down:', e.clientX, e.clientY);
      };

      const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        console.log('Mouse Move:', e.clientX, e.clientY);
      };
      const handleMouseUp = (e: React.MouseEvent) => {
        setIsDragging(false);
        console.log('Mouse Up');
      };
      return (
        <div
          className="react-draggable"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {children}
        </div>
      );
    };

    export default Draggable;

#### **第四步：让元素动起来**

为了让元素动起来，首先来推演一下元素动起来整个过程的核心逻辑。

当我们开始拖动一个元素时，第一步是确定拖拽的起点。这就需要在鼠标按下的一瞬间记录当前位置，这里可以用 `downPosition` 来保存数据。它为接下来的计算提供了一个明确的基准点，相当于为整个拖拽动作设定了起始条件。

随着鼠标的移动，元素的位置需要不断更新。这时候，我们通过计算鼠标当前位置与 `downPosition` 的差值来获取拖拽的位移量。这一位移量，再叠加上上一次拖拽结束时的最终位置 `upPosition`，就得到了元素的当前实际位置 `position`。`position` 是整个视觉变化的核心，每次更新都会直接反映在屏幕上，形成元素“跟随”鼠标移动的效果。

当鼠标松开结束拖拽时，拖拽动作达到了终点。此时，记录当前的 `position` 到 `upPosition` 中，这不仅是这次拖拽的最终结果，也为下一次拖拽提供了一个新的起点。通过这种方式，确保了每次拖拽都以之前的结束状态为基础，保持逻辑的一致性和连贯性。

`downPosition` 决定了起点，`position` 反映了实时位置，而 `upPosition` 则是终点的记录者。这些状态共同协作，构成了一个完整的拖拽系统，让元素能够平滑且精准地“动起来”。

好，让我们将上面的推演落实到代码实现。通过 `position`、`downPosition` 和 `upPosition` 的协作，来让元素动起来。

    import React, { useState } from 'react';

    const Draggable = ({ children }: { children: React.ReactNode }) => {
      const [isDragging, setIsDragging] = useState(false);
      const [position, setPosition] = useState({ x: 0, y: 0 });
      const [downPosition, setDownPosition] = useState({ x: 0, y: 0 });
      const [upPosition, setUpPosition] = useState({ x: 0, y: 0 });

      const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDownPosition({
          x: e.clientX,
          y: e.clientY,
        });
      };

      const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - downPosition.x;
        const deltaY = e.clientY - downPosition.y;
        setPosition({
          x: upPosition.x + deltaX,
          y: upPosition.y + deltaY,
        });
      };
      const handleMouseUp = (e: React.MouseEvent) => {
        setIsDragging(false);
        setUpPosition({ x: position.x, y: position.y });
      };
      return (
        <div
          className="react-draggable"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          {children}
        </div>
      );
    };

    export default Draggable;

> 我们可以把拖拽看作一场接力赛，每一次拖拽就像完成了一棒，`upPosition` 就是交接棒的位置（上一次拖拽的结束点），而 `downPosition` 是这一棒的起始点。在拖拽过程中，偏移量（`deltaX` 和 `deltaY`）就像这一棒跑出的距离。每次拖拽的位置（`position`）是由上一次的结果（`upPosition`）加上这一棒的距离（`deltaX` 和 `deltaY`）得来的。

完成后的效果如下:

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/cd72cd869bd248a097597d168975002a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgWkhR:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQxNDQzOTQ1NjIyMDIyNyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740197798&x-orig-sign=RmsGQF0oGm%2FZ9zo%2FgD7U0q%2FgGnw%3D)

## 优化 Draggable 组件：让拖拽更流畅

到这里， Draggable 组件功能已经完成了。在页面上可以拖拽元素随意移动，并在鼠标释放后停留在最终位置。但你可能注意到，在快速移动鼠标时，拖拽的流畅度会受到一定影响，尤其是拖动距离较大或者操作频繁的场景下，可能会出现明显的卡顿。那么，为什么会发生这种现象呢？

问题的核心在于，鼠标移动事件（`mousemove`）的触发频率非常高。每秒可以触发几十甚至上百次，每次触发都会调用 `setState` 来更新组件状态。在 React 中，`setState` 的调用会触发组件的重新渲染，而每次重新渲染都需要重新计算 DOM 的 `transform` 样式属性。这种高频率的状态更新和重新渲染，对性能是一个很大的消耗。当我们在拖拽中加入更多计算逻辑（比如拖拽范围限制或边界检测）时，这种性能瓶颈会更加明显，导致拖拽过程出现明显的卡顿。

为了改善这种情况，我们需要对代码进行优化。优化的核心目标是减少不必要的状态更新和渲染次数，同时让鼠标移动事件的处理更加高效。接下来，我们将结合具体技术手段，逐步优化组件。

#### 优化 1: 使用 `useRef` 避免频繁状态更新

首先，我们观察已经实现代码，会发现每次 `mousemove` 事件触发时，我们都会调用 `setState` 更新位置状态。这种操作会直接导致组件重新渲染，但实际上，拖拽中的位置变化只是一个临时状态，并不需要每次都通过 React 的状态管理来触发渲染。我们可以使用 `useRef` 来保存这些临时数据，让拖拽的逻辑独立于 React 的状态管理。

    const downPosition = useRef({ x: 0, y: 0 });
    const upPosition = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      downPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - downPosition.current.x;
      const deltaY = e.clientY - downPosition.current.y;

      setPosition({
        x: upPosition.current.x + deltaX,
        y: upPosition.current.y + deltaY,
      });
    };

这里拖拽临时我们把数据存储在 `useRef` 中，减少 `setState` 的调用频率, 避免了不必要的重新渲染。

#### 优化 2：使用 `requestAnimationFrame` 限制渲染频率

即使减少了状态更新的次数，鼠标移动事件仍会频繁触发样式更新（通过 `setPosition`）。为了解决这个问题，我们可以使用 `requestAnimationFrame` 将渲染频率限制到每秒 60 次，从而进一步提升性能。

    let animationFrame: number;

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - downPosition.current.x;
      const deltaY = e.clientY - downPosition.current.y;

      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setPosition({
          x: upPosition.current.x + deltaX,
          y: upPosition.current.y + deltaY,
        });
      });
    };

    const handleMouseUp = () => {
      cancelAnimationFrame(animationFrame);
      setIsDragging(false);
      upPosition.current = { ...position };
    };

通过使用 `requestAnimationFrame` 将样式更新与浏览器的刷新周期同步，避免过度更新导致卡顿

更高效地利用硬件资源。

#### 优化 3：使用 `useCallback` 缓存事件函数

每次组件重新渲染时，事件处理函数（如 `handleMouseMove` 和 `handleMouseUp`）都会重新创建。在我们的实现中，这些函数会通过 `useEffect` 绑定到全局事件，函数的重新创建会导致多余的事件解绑和绑定操作。通过 `useCallback` 缓存这些函数，可以避免不必要的重复操作。

    import { useCallback } from 'react';

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      setIsDragging(true);
      downPosition.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - downPosition.current.x;
      const deltaY = e.clientY - downPosition.current.y;

      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setPosition({
          x: upPosition.current.x + deltaX,
          y: upPosition.current.y + deltaY,
        });
      });
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
      cancelAnimationFrame(animationFrame);
      setIsDragging(false);
      upPosition.current = { ...position };
    }, [position]);

使用 `useCallback` 缓存函数引用，避免每次渲染时创建新函数, 减少全局事件的解绑和重新绑定操作，提高内存使用效率。

#### 优化 4： 添加拖拽范围限制

完成性能优化后，这里还有一个拖拽边界的情况：元素可以被拖拽到屏幕之外，甚至完全从视线中消失。这个问题在很多实际场景中都需要处理，比如限制拖拽元素只能在父容器中移动，或者只能在可视区域内活动。这类问题不仅影响用户体验，还可能导致布局混乱，因此我们需要对元素的拖拽范围进行限制。

最基础的场景是限制拖拽元素在窗口范围内移动。这种限制可以确保用户的拖拽操作不会超出屏幕之外。

要实现这个功能，我们需要在鼠标移动时，计算元素的新位置，并将它与窗口的边界进行比较。超过边界的部分就取边界值，这样可以保证拖拽的坐标始终在窗口内。

在现有的 `handleMouseMove` 方法中，我们只需要对 `x` 和 `y` 坐标分别加一个边界判断：

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
          if (!isDragging) return;

          const deltaX = e.clientX - downPosition.current.x;
          const deltaY = e.clientY - downPosition.current.y;

          const rect = elementRef.current?.getBoundingClientRect();
          const elementWidth = rect?.width || 0;
          const elementHeight = rect?.height || 0;

          const leftBound = 0;
          const topBound = 0;
          const rightBound = window.innerWidth - elementWidth;
          const bottomBound = window.innerHeight - elementHeight;

          const newX = Math.max(
            leftBound,
            Math.min(rightBound, upPosition.current.x + deltaX),
          );
          const newY = Math.max(
            topBound,
            Math.min(bottomBound, upPosition.current.y + deltaY),
          );

          cancelAnimationFrame(animationFrame);
          animationFrame = requestAnimationFrame(() => {
            setPosition({ x: newX, y: newY });
          });
        },
        [isDragging],
      );

> 我们看到上面使用了 `getBoundingClientRect`，它在这里主要用于动态获取拖拽元素的实际宽度和高度。这在处理拖拽边界时尤为重要，因为拖拽元素的尺寸并不是固定的，可能会因为样式、内容或屏幕尺寸的变化而有所不同。通过 `getBoundingClientRect`，我们可以实时计算出元素的宽高，从而确保在限制拖拽范围时，右下边界能够正确减去元素的尺寸，避免超出视窗范围或者触发滚动条。这种动态获取尺寸的方式，使得拖拽逻辑更加通用和精准，适配各种复杂的布局场景。

虽然窗口边界限制很常见，但在实际项目中，可能会需要更灵活的限制。例如，我们希望拖拽元素只能在父容器内移动，或者限制它只能在一个特定的矩形区域内活动。

为此，我在组件中新增了一个 `bounds` 属性，允许用户通过参数自定义拖拽范围。`bounds` 接受一个对象，定义上下左右四个边界。

组件新增 `bounds` 属性后，我们需要修改 `handleMouseMove` 方法，让它动态适配用户传递的边界值：

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - downPosition.current.x;
      const deltaY = e.clientY - downPosition.current.y;

      const rect = elementRef.current?.getBoundingClientRect();
      const elementWidth = rect?.width || 0;
      const elementHeight = rect?.height || 0;

      const leftBound = bounds?.left ?? 0;
      const topBound = bounds?.top ?? 0;
      const rightBound = bounds?.right !== undefined 
        ? bounds.right - elementWidth 
        : window.innerWidth - elementWidth;
      const bottomBound = bounds?.bottom !== undefined 
        ? bounds.bottom - elementHeight 
        : window.innerHeight - elementHeight;

      const newX = Math.max(leftBound, Math.min(rightBound, upPosition.current.x + deltaX));
      const newY = Math.max(topBound, Math.min(bottomBound, upPosition.current.y + deltaY));

      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setPosition({ x: newX, y: newY });
      });
    }, [isDragging, bounds]);

通过这个改动，`bounds` 的默认值是窗口的边界（`0` 到 `window.innerWidth` 和 `window.innerHeight`），但用户也可以根据实际需求传入更精确的范围

## 完整代码

    import React, { useState, useRef, useEffect, useCallback } from 'react';

    const Draggable = ({ 
      children, 
      bounds 
    }: { 
      children: React.ReactNode; 
      bounds?: { left: number; top: number; right: number; bottom: number } 
    }) => {
      const [position, setPosition] = useState({ x: 0, y: 0 });
      const [isDragging, setIsDragging] = useState(false);

      const downPosition = useRef({ x: 0, y: 0 });
      const upPosition = useRef({ x: 0, y: 0 });
      const elementRef = useRef<HTMLDivElement | null>(null);
      let animationFrame: number;

      const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        downPosition.current = { x: e.clientX, y: e.clientY };
      }, []);

      const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - downPosition.current.x;
        const deltaY = e.clientY - downPosition.current.y;

        const rect = elementRef.current?.getBoundingClientRect();
        const elementWidth = rect?.width || 0;
        const elementHeight = rect?.height || 0;

        const leftBound = bounds?.left ?? 0;
        const topBound = bounds?.top ?? 0;
        const rightBound = bounds?.right !== undefined 
          ? bounds.right - elementWidth 
          : window.innerWidth - elementWidth;
        const bottomBound = bounds?.bottom !== undefined 
          ? bounds.bottom - elementHeight 
          : window.innerHeight - elementHeight;

        const newX = Math.max(leftBound, Math.min(rightBound, upPosition.current.x + deltaX));
        const newY = Math.max(topBound, Math.min(bottomBound, upPosition.current.y + deltaY));

        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
          setPosition({ x: newX, y: newY });
        });
      }, [isDragging, bounds]);

      const handleMouseUp = useCallback(() => {
        cancelAnimationFrame(animationFrame);
        setIsDragging(false);
        upPosition.current = { ...position };
      }, [position]);

      useEffect(() => {
        if (isDragging) {
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', handleMouseUp);
        } else {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }, [isDragging, handleMouseMove, handleMouseUp]);

      return (
        <div
          ref={elementRef}
          className="react-draggable"
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {children}
        </div>
      );
    };

    export default Draggable;

## 总结与扩展

到此为止，我们今天要实现的 Draggable 组件已经完成。从最基础的拖拽功能开始，我们逐步完善了性能优化和用户体验的细节，包括通过 `getBoundingClientRect` 动态计算元素尺寸以适配视窗边界，以及新增 `bounds` 属性以支持用户自定义拖拽范围。

整个实现过程中，我们解决了拖拽中常见的性能问题，比如高频状态更新引发的卡顿，通过 `useRef` 和 `requestAnimationFrame` 优化了渲染逻辑；同时，在边界限制上，我们让组件不仅能够适配视窗，还支持灵活的范围控制, 大大增强了组件的适用性和扩展性。

今天实现的Draggable 组件不仅是一个功能模块，它的实现思路也可以成为开发其他交互组件的参考模板。如果你有更复杂的需求，比如在拖拽结束时触发特定事件、或者支持多设备的触控拖拽，这个组件依然可以作为良好的基础进行扩展。

如果你对拖拽功能感兴趣，并且更倾向于使用 Vue3，也可以试试我开源的 (<a href="https://github.com/marshal-zheng/vue-draggable" target="_blank" rel="noopener">**@marsio/vue-draggable**</a>) 组件。这个开源库不仅实现了类似的功能，还支持更多高级特性，比如多目标拖拽、动态边界、方向控制、事件回调、受控与非受控支持等。最重要的是，开源组件可以直接应用到实际项目中，省去你从零实现的时间成本，同时也可以参与其中，共同优化和维护。

期待你的反馈，也欢迎 Star 支持！如果你对这篇文章或相关实现有任何问题，随时留言讨论。下次我们再探索更多有趣的交互功能，敬请期待！🎉
