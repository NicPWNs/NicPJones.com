---
title: "Coding Data Structures: Linked Lists"
date: 2022-05-03
slug: coding-data-structures-linked-lists
excerpt: "An introduction to linked lists: how this dynamic data structure works, how it compares to arrays, and its Big-O time and space complexity, with examples."
source: https://blog.nicpwns.com/coding-data-structures-linked-lists-2f5ff40b14d5
tags: ["coding"]
---

Let’s cover a basic coding data structure: *linked lists*. Linked lists are a basic data structure that are a different approach to traditional lists and arrays. Each element in a linked list is called a *node* which contains the stored data as well as a pointer to the next node. This disjointed approach to lists allows for more efficient insertion and removal of elements because they do not need to be stored adjacently in memory.

![Linked list visualization.](/writeups/coding-data-structures-linked-lists/img-1.png)

*Linked list visualization.*

## Linked List vs. Array

| Linked Lists | Arrays |
| --- | --- |
| Have a dynamic size. Not restricted by initial memory allocation. | Have a fixed size. Array must be recreated if size is exceeded. |
| Insertions/deletions are efficient. Simply add a node and update pointers. | Insertions/deletions are inefficient. Adjacent elements need to be shifted. |
| Random access is not possible without element indexes. | Random access is possible using indexes of elements. |
| No memory waste due to dynamic memory allocation. | Potential memory waste if an array is not full. |
| Sequential access is slow due to disjointed memory locations. | Sequential access is fast due to elements adjacent memory locations. |

## Linked List Big-O Complexity

![Big-O Complexity](/writeups/coding-data-structures-linked-lists/img-2.png)

*Big-O Complexity*

### Time Complexity

**Access/Search:** O(n) — Linear time. Linked list must be looped/iterated through to locate elements.

**Insertion/Deletion:** O(1) — Constant time. Elements can be added or removed by modifying a single node and updating pointers.

### Space Complexity

**All Cases:** O(n) — Linear space. Linked lists contain two pieces of data for each node. As the list increases in size, so does the space used.

## Linked Lists Use Cases

-   Linked lists are often used for the implementation of other data types like stacks, queues, trees, and graphs.
-   **Real world:**
-   Music playlist — Each song is a node in a greater list. Songs can be easily arranged within the playlist.
-   Forward/back browser buttons — Each page is a node that can be traversed to in order.
-   Slideshow — Each slide is a node that can be traversed in order or rearranged.

## Linked Lists Python Implementation

My full linked list Python implementation can be found on my [GitHub](https://github.com/NicPWNs/CodingPractice/blob/main/data-structures-algorithms/data-structures/linked-list/linked-list.py). I’ve broken it out into the components of the data structure below.

### Node Definition

A node object within a linked list has two member values. The `data` value stores data and the `next` value stores a pointer to the next node. These are `None` type by default. The last node in a linked list will always have a next value of `None` because it doesn't have a node to point to.

```
class Node:
    def __init__(self, data=None, next=None):
        self.data = data
        self.next = next
```

### List Definition

The linked list object simply has to store a pointer to the first node, known as the “head” of the linked list. The following functions are also contained within the `LinkedList` class.

```
class LinkedList:
    def __init__(self):
        self.head = None
```

### End Insert Functions

These functions add a node to the start or the end of the linked list. The `insert_at_start` function creates a new node and makes it the new head of the linked list. The `insert_at_end` function adds a head node if there are no nodes in the linked list or it iterates to the end of the linked list and adds a new node at the end.

```
class LinkedList:
    def insert_at_start(self, data):
        node = Node(data, self.head)
        self.head = node
    def insert_at_end(self,data):
        if self.head is None:
            self.head = Node(data, None)
            return
        itr = self.head
        while itr.next:
            itr = itr.next
        itr.next = Node(data, None)
```

### Length Function

The `get_length` function simply iterates through the entire linked list and keeps a count of the length.

```
class LinkedList:
    def get_length(self):
        count = 0
        itr = self.head
        while itr:
            count+=1
            itr = itr.next
        return
```

### Insert Functions

These functions insert values to the linked list. The `insert_values` function essentially creates a whole new linked list by setting the head to `None` type and then looping through provided data to form a linked list. The `insert_at` function inserts a value at a given index by iterating through the linked list until the next node is the desired index, then it inserts a new node. It also first does some checking to see if the desired index is out of range or is the head of the linked list.

```
class LinkedList:
    def insert_values(self, data_list):
        self.head = None
        for data in data_list:
            self.insert_at_end(data)
    def insert_at(self, index, data):
        if index<0 or index>=self.get_length():
            raise Exception("Not a valid index!")
        if index==0:
            self.insert_at_start(data)
        count = 0
        itr = self.head
        while itr:
            if count == index - 1:
                node = Node(data, itr.next)
                itr.next = node
                break
            itr = itr.next
            count+=1
```

### Remove Function

The `remove_at` function removes a node at a given index. Much like the `insert_at` function it first verifies that the index is valid and if the desired index is the head of the linked list. Otherwise, the function iterates through the linked list until it is a node before the desired index and then removes the desired node by updating the pointers.

```
class LinkedList:
    def remove_at(self, index):
        if index<0 or index>=self.get_length():
            raise Exception("Not a valid index!")
        if index==0:
            self.head = self.head.next
            return
        count = 0
        itr = self.head
        while itr:
            if count == index - 1:
                itr.next = itr.next.next
                break
            itr = itr.next
            count+=1
```

### By Value Functions

These functions insert or remove nodes based on value rather than index. They work much like the index-based insert and remove functions, except they do not need to count an index number and instead iterate through the linked list until a node contains matching data.

```
class LinkedList:
    def insert_after_value(self, after, data):
        if self.head is None:
            return
        if self.head.data == after:
            self.head.next = Node(data, self.head.next)
            return
        itr = self.head
        while itr:
            if itr.data == after:
                itr.next = Node(data, itr.next)
                break
            itr = itr.next
    def remove_by_value(self, data):
        if self.head is None:
            return
        if self.head.data == data:
            self.head = self.head.next
            return
        itr = self.head
        while itr.next:
            if itr.next.data == data:
                itr.next = itr.next.next
                break
            itr = itr.next
```

### Print Function

The `print` function is a necessity for testing all of the other functions and seeing the implementation in action. This function iterates through the linked list and concatenates all nodes with a `->` as a delimiter for visualizing the linked list.

```
class LinkedList:
    def print(self):
        if self.head is None:
            print("Linked list is empty!")
            return
        itr = self.head
        llstr = ""
        while itr:
            llstr += str(itr.data) + "->"
            itr = itr.next
        print(llstr)
```

## Even More

-   There’s also a variation of linked lists called a doubly linked list. It’s just like a linked list except it has pointers in each node going in both directions. This means that the linked list can be traversed in either direction, not just starting at the head. The Python implementation of this data structure is similar and I have it on my [GitHub](https://github.com/NicPWNs/CodingPractice/blob/main/data-structures-algorithms/data-structures/linked-list/doubly-linked-list.py) as well.
-   Even more complex is a [circular linked list](https://www.geeksforgeeks.org/circular-linked-list/). You guessed it, the entire list loops where the end node actually points to the head node. So there actually is no end or head node. This type of linked list has no null values without any ends.

That’s linked lists! Be sure to check out all of my posts about [coding](/notes?tag=coding) and other [algorithms](/notes?tag=coding) and [data structures](/notes?tag=coding).
