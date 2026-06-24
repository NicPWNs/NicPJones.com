---
title: "Coding Algorithms: Bubble Sort"
date: 2022-04-28
slug: coding-algorithms-bubble-sort
excerpt: "Let’s cover a basic coding algorithm: bubble sort. Bubble sort is a basic sorting algorithm that steps through a list or array of elements and compares two…"
source: https://blog.nicpwns.com/coding-algorithms-bubble-sort-e403bdc7ae51
tags: ["coding"]
---

<p>Let’s cover a basic coding algorithm: <em>bubble sort</em>. Bubble sort is a basic sorting algorithm that steps through a list or array of elements and compares two adjacent elements at a time and swaps them to result in a fully sorted list. The idea is that the elements of greater value being swapped will “float” to the top of the list like a bubble. The list to be sorted could be numeric values, strings, or other data types depending on the implementation. Bubble sort is also sometimes referred to as <em>sinking sort</em>.</p>
<figure><img src="/writeups/coding-algorithms-bubble-sort/img-1.png" alt="A visual representation of bubble sort."  decoding="async" width="1600" height="1333" loading="eager" fetchpriority="high" /><figcaption>A visual representation of bubble sort.</figcaption></figure>
<h2>Logical Steps</h2>
<ol><li>Compare the first element in the list to the next element in the list.</li><li>If the first element is greater than the second, swap them. If not, move along.</li><li>Step to the next pair to compare in the list. Compare the second element to the next element.</li><li>Repeat step 2.</li><li>Repeat until the end of the list is reached. The greatest element will now be at the end.</li><li>The sorting is not done. Repeat steps 1 through 5 for one less than the number of items in the list <em>or</em> until the list is fully sorted.</li></ol>
<figure><img src="/writeups/coding-algorithms-bubble-sort/img-2.gif" alt="Bubble sort in action for a small list."  decoding="async" width="300" height="180" loading="lazy" /><figcaption>Bubble sort in action for a small list.</figcaption></figure>
<h2>Big-O Complexity</h2>
<figure><img src="/writeups/coding-algorithms-bubble-sort/img-3.png" alt="Big-O Complexity"  decoding="async" width="997" height="716" loading="lazy" /><figcaption>Big-O Complexity</figcaption></figure>
<h3>Time Complexity</h3>
<p><strong>Worst/Average: </strong>O(n²) — Quadratic time. Usually two nested loops are needed for implementation.</p>
<p><strong>Best: </strong>O(n) — Linear time. This is only the case when the list or array is already sorted. One loop will run to discover the list is already sorted.</p>
<h3>Space Complexity</h3>
<p><strong>All Cases: </strong>O(1) — Constant space. The same amount of elements are stored in memory despite sorting.</p>
<h2>Use Cases</h2>
<ul><li>Bubble sort is one of the simplest and most discussed sorting algorithms but actually has very little use in the real world due to its slow speed.</li><li>The primary use for bubble sort is that it is a good introduction to sorting algorithms for educational reasons. (Like this!)</li><li>The only case where bubble sort finds some use is in an implementation that requires the sorting of a single set of two elements. This is usually found in types of error checking where a single swap may be needed. Bubble sort is reliable for this use case.</li></ul>
<h2>Python Implementation</h2>
<p>My full bubble sort Python implementation can be found on my <a href="https://github.com/NicPWNs/CodingPractice/blob/main/data-structures-algorithms/algorithms/bubble-sort/bubble-sort.py">GitHub</a>. I’ve broken it out into the main stages of development here below.</p>
<h3>Initial Sort</h3>
<p>The initial sort is just one iteration of the algorithm to float the greatest value to the end. The sorting is not complete with this alone.</p>
<pre><code>def bubble_sort(elements):
        # Loop to float the largest element to the end
        for i in range(len(elements)-1):
            # Check if current element is greater than the next element
            if elements[i] &gt; elements[i+1]:
                # Set the current element to a temporary variable
                tmp = elements[i]
                # Set the current element to the elements of the next element
                elements[i] = elements[i+1]
                # Set the next element to the original elements of the first element
                elements[i+1] = tmp</code></pre>
<h3>Full Sort</h3>
<p>To complete the full sorting algorithm, the entire previous iteration must be repeated for as many items in the array. This is working bubble sort.</p>
<pre><code>def bubble_sort(elements):
    # Outer loop to repeatedly float the largest element to the end
    for j in range(len(elements)-1):
        # Inner loop to float the largest element to the end
        for i in range(len(elements)-1):
            # Check if current element is greater than the next element
            if elements[i] &gt; elements[i+1]:
                # Set the current element to a temporary variable
                tmp = elements[i]
                # Set the current element to the elements of the next element
                elements[i] = elements[i+1]
                # Set the next element to the original elements of the first element
                elements[i+1] = tmp</code></pre>
<h3>Efficiency Improvements</h3>
<h3>Avoid Looping Through Already Sorted Values</h3>
<p>The current implementation will end up looping through values at the end of the list that we know are already sorted. We want to prevent this to reduce unnecessary computations. If the iterator of the outer loop is subtracted from the loop range of the inner loop, this can be avoided. Notice the very small change of adding <code>-j</code> , the outer loop iterator, to the inner loop range.</p>
<pre><code>def bubble_sort(elements):
    # Outer loop to repeatedly float the largest element to the end
    for j in range(len(elements)-1):
        # Inner loop to float the largest element to the end
        for i in range(len(elements)-1-j):
            # Check if current element is greater than the next element
            if elements[i] &gt; elements[i+1]:
                # Set the current element to a temporary variable
                tmp = elements[i]
                # Set the current element to the elements of the next element
                elements[i] = elements[i+1]
                # Set the next element to the original elements of the first element
                elements[i+1] = tmp</code></pre>
<h3>Stop Looping Through a Sorted Array</h3>
<p>To avoid looping through a fully sorted array and causing unnecessary computations, a <code>sorted</code> Boolean is set. If at any point the inner loop does not sort any values, this means the sorting is complete and the outer loop can break. Every time the inner loop sorts, the Boolean is set to False to continue the sorting.</p>
<pre><code>def bubble_sort(elements):
    # Outer loop to repeatedly float the largest element to the end
    for j in range(len(elements)-1):
        # Define boolean to track when elements are no longer being sorted
        sorted = True
        # Inner loop to float the largest element to the end
        # Subtract iterator of outer loop (j) to prevent comapring already sorted elements
        for i in range(len(elements)-1-j):
            # Check if current element is greater than the next element
            if elements[i] &gt; elements[i+1]:
                # Set the current element to a temporary variable
                tmp = elements[i]
                # Set the current element to the elements of the next element
                elements[i] = elements[i+1]
                # Set the next element to the original elements of the first element
                elements[i+1] = tmp
                # Set sorted to False if sorting is still happening
                sorted = False
        # If sorting hasn't happened then sorting is complete
        if sorted:
            break</code></pre>
<p>That’s bubble sort! Be sure to check out all of my posts about <a href="/notes?tag=coding">coding</a> and other <a href="/notes?tag=coding">algorithms</a> and <a href="/notes?tag=coding">data structures</a>.</p>
