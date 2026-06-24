---
title: "Coding Data Structures: Linked Lists"
date: 2022-05-03
slug: coding-data-structures-linked-lists
excerpt: "Let’s cover a basic coding data structure: linked lists. Linked lists are a basic data structure that are a different approach to traditional lists and arrays.…"
source: https://blog.nicpwns.com/coding-data-structures-linked-lists-2f5ff40b14d5
tags: ["coding"]
---

<p>Let’s cover a basic coding data structure: <em>linked lists</em>. Linked lists are a basic data structure that are a different approach to traditional lists and arrays. Each element in a linked list is called a <em>node</em> which contains the stored data as well as a pointer to the next node. This disjointed approach to lists allows for more efficient insertion and removal of elements because they do not need to be stored adjacently in memory.</p>
<figure><img src="/writeups/coding-data-structures-linked-lists/img-1.png" alt="Linked list visualization." /><figcaption>Linked list visualization.</figcaption></figure>
<h3>Linked List vs. Array</h3>
<table><thead><tr><th>Linked Lists</th><th>Arrays</th></tr></thead><tbody><tr><td>Have a dynamic size. Not restricted by initial memory allocation.</td><td>Have a fixed size. Array must be recreated if size is exceeded.</td></tr><tr><td>Insertions/deletions are efficient. Simply add a node and update pointers.</td><td>Insertions/deletions are inefficient. Adjacent elements need to be shifted.</td></tr><tr><td>Random access is not possible without element indexes.</td><td>Random access is possible using indexes of elements.</td></tr><tr><td>No memory waste due to dynamic memory allocation.</td><td>Potential memory waste if an array is not full.</td></tr><tr><td>Sequential access is slow due to disjointed memory locations.</td><td>Sequential access is fast due to elements adjacent memory locations.</td></tr></tbody></table>
<h3>Linked List Big-O Complexity</h3>
<figure><img src="/writeups/coding-data-structures-linked-lists/img-2.png" alt="Big-O Complexity" /><figcaption>Big-O Complexity</figcaption></figure>
<h4>Time Complexity</h4>
<p><strong>Access/Search:</strong> O(n) — Linear time. Linked list must be looped/iterated through to locate elements.</p>
<p><strong>Insertion/Deletion:</strong> O(1) — Constant time. Elements can be added or removed by modifying a single node and updating pointers.</p>
<h4>Space Complexity</h4>
<p><strong>All Cases: </strong>O(n) — Linear space. Linked lists contain two pieces of data for each node. As the list increases in size, so does the space used.</p>
<h3>Linked Lists Use Cases</h3>
<ul><li>Linked lists are often used for the implementation of other data types like stacks, queues, trees, and graphs.</li><li><strong>Real world:</strong></li><li>Music playlist — Each song is a node in a greater list. Songs can be easily arranged within the playlist.</li><li>Forward/back browser buttons — Each page is a node that can be traversed to in order.</li><li>Slideshow — Each slide is a node that can be traversed in order or rearranged.</li></ul>
<h3>Linked Lists Python Implementation</h3>
<p>My full linked list Python implementation can be found on my <a href="https://github.com/NicPWNs/CodingPractice/blob/main/data-structures-algorithms/data-structures/linked-list/linked-list.py">GitHub</a>. I’ve broken it out into the components of the data structure below.</p>
<h4>Node Definition</h4>
<p>A node object within a linked list has two member values. The <code>data</code> value stores data and the <code>next</code> value stores a pointer to the next node. These are <code>None</code> type by default. The last node in a linked list will always have a next value of <code>None</code> because it doesn't have a node to point to.</p>
<pre><code>class Node:
    def __init__(self, data=None, next=None):
        self.data = data
        self.next = next</code></pre>
<h4>List Definition</h4>
<p>The linked list object simply has to store a pointer to the first node, known as the “head” of the linked list. The following functions are also contained within the <code>LinkedList</code> class.</p>
<pre><code>class LinkedList:
    def __init__(self):
        self.head = None</code></pre>
<h4>End Insert Functions</h4>
<p>These functions add a node to the start or the end of the linked list. The <code>insert_at_start</code> function creates a new node and makes it the new head of the linked list. The <code>insert_at_end</code> function adds a head node if there are no nodes in the linked list or it iterates to the end of the linked list and adds a new node at the end.</p>
<pre><code>class LinkedList:
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
        itr.next = Node(data, None)</code></pre>
<h4>Length Function</h4>
<p>The <code>get_length</code> function simply iterates through the entire linked list and keeps a count of the length.</p>
<pre><code>class LinkedList:
    def get_length(self):
        count = 0
        itr = self.head
        while itr:
            count+=1
            itr = itr.next
        return</code></pre>
<h4>Insert Functions</h4>
<p>These functions insert values to the linked list. The <code>insert_values</code> function essentially creates a whole new linked list by setting the head to <code>None</code> type and then looping through provided data to form a linked list. The <code>insert_at</code> function inserts a value at a given index by iterating through the linked list until the next node is the desired index, then it inserts a new node. It also first does some checking to see if the desired index is out of range or is the head of the linked list.</p>
<pre><code>class LinkedList:
    def insert_values(self, data_list):
        self.head = None
        for data in data_list:
            self.insert_at_end(data)
    def insert_at(self, index, data):
        if index&lt;0 or index&gt;=self.get_length():
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
            count+=1</code></pre>
<h4>Remove Function</h4>
<p>The <code>remove_at</code> function removes a node at a given index. Much like the <code>insert_at</code> function it first verifies that the index is valid and if the desired index is the head of the linked list. Otherwise, the function iterates through the linked list until it is a node before the desired index and then removes the desired node by updating the pointers.</p>
<pre><code>class LinkedList:
    def remove_at(self, index):
        if index&lt;0 or index&gt;=self.get_length():
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
            count+=1</code></pre>
<h4>By Value Functions</h4>
<p>These functions insert or remove nodes based on value rather than index. They work much like the index-based insert and remove functions, except they do not need to count an index number and instead iterate through the linked list until a node contains matching data.</p>
<pre><code>class LinkedList:
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
            itr = itr.next</code></pre>
<h4>Print Function</h4>
<p>The <code>print</code> function is a necessity for testing all of the other functions and seeing the implementation in action. This function iterates through the linked list and concatenates all nodes with a <code>-&gt;</code> as a delimiter for visualizing the linked list.</p>
<pre><code>class LinkedList:
    def print(self):
        if self.head is None:
            print("Linked list is empty!")
            return
        itr = self.head
        llstr = ""
        while itr:
            llstr += str(itr.data) + "-&gt;"
            itr = itr.next
        print(llstr)</code></pre>
<h3>Even More</h3>
<ul><li>There’s also a variation of linked lists called a doubly linked list. It’s just like a linked list except it has pointers in each node going in both directions. This means that the linked list can be traversed in either direction, not just starting at the head. The Python implementation of this data structure is similar and I have it on my <a href="https://github.com/NicPWNs/CodingPractice/blob/main/data-structures-algorithms/data-structures/linked-list/doubly-linked-list.py">GitHub</a> as well.</li><li>Even more complex is a <a href="https://www.geeksforgeeks.org/circular-linked-list/">circular linked list</a>. You guessed it, the entire list loops where the end node actually points to the head node. So there actually is no end or head node. This type of linked list has no null values without any ends.</li></ul>
<p>That’s linked lists! Be sure to check out all of my posts about <a href="/notes?tag=coding">coding</a> and other <a href="/notes?tag=coding">algorithms</a> and <a href="/notes?tag=coding">data structures</a>.</p>
