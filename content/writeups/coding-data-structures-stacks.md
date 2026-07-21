---
title: "Coding Data Structures: Stacks"
date: 2022-05-17
slug: coding-data-structures-stacks
excerpt: "An introduction to the stack data structure: how last-in, first-out (LIFO) ordering works, the push and pop operations, and where stacks get used."
source: https://medium.com/@NicPWNs/coding-data-structures-stacks-1a0b8c97f820?source=rss-57a2a039424d------2
tags: ["coding"]
---

Let’s cover a basic coding data structure: *stacks*. Stacks are a basic data structure that are like lists and arrays, but have a last in, first out (LIFO) property when adding and removing elements. Elements in a stack can either be “pushed” onto the stack to be added, or “popped” from the stack to be removed. A classic example is a heavy stack of dishes where plates can only be added and removed from the top.

![Stacks are like a stack of plates.](/writeups/coding-data-structures-stacks/img-1.jpg)

*Stacks are like a stack of plates.*

## Stack Big-O Complexity

![Big-O Complexity](/writeups/coding-data-structures-stacks/img-2.png)

*Big-O Complexity*

### Time Complexity

**Access/Search:** O(n) — Linear time. Stacks must be looped/iterated through to locate elements.

**Insertion/Deletion:** O(1) — Constant time. Elements can be added or removed by pushing onto the stack or popping from the stack.

### Space Complexity

**All Cases:** O(n) — Linear space. Stacks contain a linear amount of data. As the stack increases in size, so does the space used.

## Stack Use Cases

-   Program Function Calling — Programming interpreters and compilers keep track of function call execution in a stack. If function a() calls function b(), function a() will be pushed onto the stack with function b() on top of it. When function b() finishes execution to return to function a(), it will be popped from the stack.
-   Undo (CTRL+Z) — Undo operations in applications like Microsoft Word use a stack to undo or “pop” the last edit made from the stack.

## Stack Python Implementation

The regular Python list data type has pop() and append() functions that can make it work as a stack. However, Python lists are dynamic arrays and fully reassign memory locations whenever they grow past their originally assigned size in memory. This can make Python lists very inefficient to use for stacks, so the recommended approach is to use deque from the Python standard collections library which resolves this issue.

My full stack Python implementation can be found on my [GitHub](https://github.com/NicPWNs/CodingPractice/blob/main/data-structures-algorithms/data-structures/stack/stack.py). I’ve broken it out into the components of the data structure below.

### Stack Definition

We import deque from the collections library and define our stack as a new deque object.

```
from collections import deque
class Stack:
    def __init__(self):
        self.container = deque()
```

### Push Function

Within our Stack class we define a push() function that takes an element to be appended onto the stack.

```
class Stack:
    def push(self,val):
        self.container.append(val)
```

### Pop Function

Within our Stack class we define a pop() function that removes the top element from the stack.

```
class Stack:
    def pop(self):
        return self.container.pop()
```

### Peek Function

Within our Stack class we define a peek() function that returns the top element on the stack.

```
class Stack:
    def peek(self):
        return self.container
```

### Empty Checking Function

Within our Stack class we define an is\_empty() function that checks if the length of the stack is zero and returns a boolean (True/False).

```
class Stack:
    def is_empty(self):
        return len(self.container)==0
```

### Size Function

Within our Stack class we define a size() function that returns the length of the stack.

```
class Stack:
    def size(self):
        return len(self.container)
```

## Even More

-   Queues are often considered the counterpart to the Stack data structure because they have a first in, first out (FIFO) property instead of stacks’ LIFO property. I will cover the queue data structure in a future post.
-   Remember that stacks are often implemented on top of a singly linked list data structure which manages the elements of a stack as nodes in a linked list. Linked lists are useful for stacks because only the end element needs to be accessed for both data structures. Check out my blog post about [Linked lists here](/notes/coding-data-structures-linked-lists).

That’s stacks! Be sure to check out all of my posts about [coding](/notes?tag=coding) and other [algorithms](/notes?tag=coding) and [data structures](/notes?tag=coding).
