---
title: 'Test Markdown Features Post'
description: 'Testing MathJax rendering inside an Astro blog post'
date: 2025-06-29
tags: ['test']
mathjax: true
---

### Checking Math ($x$, $y$)

<!-- ## Checking Math -->

Here is some inline math: $x^2 + y^2 = z^2$.

$$
L_1 = \frac{1}{3} \rho v^2 S C_L
$$

This is an integral:

$$
\int\limits_\mathclap{-\infty}^\mathclap{\infty} \! e^{-x^2}\,\mathrm{d}x = \sqrt{2\pi}
$$

<!-- $$
\int\limits_{-\infty}^{\infty} \! e^{-x^2}\,\mathrm{d}x = \sqrt{2\pi}
$$ -->

This is the Binomial Theorem:

$$
(1 + x)^n = \sum\limits_{k\,=\,0}^n \binom{n}{k}x^k
$$

$$
(1 - x)^n = \sum\limits_{k\,=\,0}^n (-1)^k\binom{n}{k}x^k
$$

### Checking Mermaid

A mermaid diagram:

```mermaid
graph TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Celebrate]
  B -- No --> D[Debug]
  D --> B
```

A more complex diagram:

```mermaid
flowchart TB
  subgraph Interpretation 2
    direction TB
    A(+)-->B(a)
    A(+)-->C(+)
    C-->D(b)
    C-->E(c)
  end
  subgraph Interpretation 1
    direction TB
    G(+)-->H(+)
    H-->I(a)
    H-->J(b)
    G-->K(c)
  end
```

### Checking gemoji

:+1:

### Checking Code

Basic code snippet:

```cpp
#include <iostream>

int main() {
  std::cout << "Hello World!\n";
}
```

With line numbers:

```js showLineNumbers=true
let a1
let a2
let a3
```

### Checking External Links

Let's check a link [like this](https://www.mathjax.org/).
