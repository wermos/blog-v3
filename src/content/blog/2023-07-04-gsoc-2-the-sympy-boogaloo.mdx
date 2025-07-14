---
title: 'GSoC 2 — The SymPy Boogaloo'
date: 2023-07-04 20:25:37 +0530
description: 'In this blog post, I will discuss what my 2nd GSoC project is about.'
image: '@/assets/images/gsoc/gsoc-logo-with-sympy-logo.png'
mathjax: true
tags: ['gsoc', 'sympy']
---

import Callout from '@/components/Callout.astro'

## GSoC with SymPy

In 2023, I decided to apply to just one organization for GSoC: SymPy. I was interested in the parsing, codegen, and printing modules as I had worked with all 3, and solved some interesting bugs in the parsing and printing submodules.

I knew that, in the past, SymPy has had a little trouble with finding mentors, even for projects they wanted, so I decided to send an [email](https://groups.google.com/g/sympy/c/NewnNlFSrYc/m/PUAJj7i9AQAJ) to the SymPy mailing list to gauge interest in having a GSoC project in either the parsing or codegen submodules.

I chose to ask about these two submodules specifically, because out of the three submodules in which I have previous experience, the [codegen submodule](https://github.com/sympy/sympy/wiki/GSoC-Ideas#code-generation) and the [parsing submodule](https://github.com/sympy/sympy/wiki/GSoC-Ideas#parsing) have their own dedicated sections on the GSoC Ideas page.

In response to my email, [Aaron Meurer](https://www.asmeurer.com/blog/about/) replied with a few potential GSoC project ideas. Of those ideas, I ended up choosing to write a proposal about rewriting the LaTeX parser, because it is widely used by the community.

### Wait, what is SymPy?

As the About section on [SymPy's GitHub](https://github.com/sympy/sympy) says, SymPy is

> A computer algebra system written in pure Python

The way I like to explain it to people is like this: If I were to ask MATLAB what the value of $d$ is, where

$$
d = \int\limits_1^2 \! \dfrac{1}{x}\,\mathrm{d}x,
$$

The answer I would get is `d = 0.6931`, by running

```matlab title="matlab_example.m" showLineNumbers=true
func = @(x) 1./x
d = integral(func, 1, 2)
```

On the other hand, if I run the following SymPy code

```py title="python_example.py" showLineNumbers=true
import sympy as sp
from sympy.abc import x

func = 1 / x
d = sp.integrate(func, (x, 1, 2))

print(f"d = {d}")
```

I get the output `d = log(2)`.

In MATLAB's case, I got the approximate numerical value, whereas in SymPy's case, I got the symbolic answer.

<Callout variant="note">
  I am aware that MATLAB has a [Symbolic Math
  Toolbox™](https://in.mathworks.com/products/symbolic.html) which gives MATLAB
  symbolic capabilities. On the flip side, running `d.evalf()` at the end of the
  SymPy snippet will print `0.693147180559945` on the terminal. Therefore, the
  above example is simplistic, but it helps me get the point across.
</Callout>

## The Project

My project, as I briefly mentioned, is to rewrite the LaTeX parser using [Lark](https://github.com/lark-parser/lark.git) as the parser generator, instead of [ANTLR](https://www.antlr.org/).

### My GSoC Proposal

My proposal can be found [here](https://docs.google.com/document/d/1QgOpu5xwl-i1TBa_TA_qtyvUEc-o_1UBR4SsM-VZmS0/edit?usp=sharing). As such, my proposal doesn't deviate much from the original plan, unlike [last time](/blog/2022-08-30-gsoc-the-details-of-my-project#my-project-proposal).

### What is the LaTeX Parser?

The [LaTeX parser](https://docs.sympy.org/latest/modules/parsing.html#experimental-mathrm-latex-parsing) is one of the submodules in SymPy which allows you to convert a LaTeX expression into a SymPy expression. For example, if I have some LaTeX code like `\int\! x^2 \,dx`, I can convert it into a SymPy expression by running:

```py showLineNumbers=true
from sympy.parsing.latex import parse_latex

expr = parse_latex(r"2ab")
```

Once you have this expression, you can do things like substituting values. For example, running `expr.evalf(subs=dict(a=5, b=2))` after running the above snippet, will give us `20.0000000000000` as the output.

### Why Does It Need a Rewrite?

To get the full picture, we first need to understand the history of the LaTeX parser in SymPy, and how it came to be.

#### Some History

Here is a snippet from the [documentation for the LaTeX parser](https://docs.sympy.org/latest/modules/parsing.html#experimental-mathrm-latex-parsing):

> $\mathrm{\LaTeX}$ parsing was ported from [latex2sympy](https://github.com/augustt198/latex2sympy). While functional and its API should remain stable, the parsing behavior or backend may change in future releases.

If we look at the linked GitHub repository, we see that the project was originally started in January 2016 by [augustt198](https://github.com/augustt198).

This repository solved a long-standing feature request that people had asked for, as can be seen in this [SymPy mailing list email thread](https://groups.google.com/g/sympy/c/JxtvnWeRC7s) and [this](https://github.com/sympy/sympy/issues/5418) old SymPy issue.

Soon after the repository was made, long-term SymPy contributor [@moorepants](https://github.com/moorepants) mentioned in [Issue #1](https://github.com/augustt198/latex2sympy/issues/1) that the SymPy community was interested in bring the codebase into SymPy itself.

After that, the `latex2sympy` code was merged into SymPy in [#13706](https://github.com/sympy/sympy/pull/13706).

The reason the history is important is to understand why ANTLR was used: Originally, since the LaTeX parser was not a part of SymPy, [augustt198](https://github.com/augustt198) was free to use whatever library he wanted, and he likely felt most comfortable using ANTLR for the task.

However, after the code became a part of SymPy (and even while that process was happening), there were [some concerns](https://github.com/sympy/sympy/pull/13706#issuecomment-360930090) about having ANTLR as an optional dependency. The priority at the time, however, was to get a LaTeX parser into SymPy as a sort of reference implementation or a baseline, and worry about the rest later.

#### Issues

There were a few issues with ANTLR, which is the reason other alternatives were being considered:

1. The runtime package can be difficult to install. There have [been](https://github.com/augustt198/latex2sympy/issues/32) [reports](https://github.com/sympy/sympy/issues/14004#issuecomment-1072591073) of users who found the LaTeX parser's runtime dependencies difficult to install. There are a couple of packages on conda-forge with closely related names: `antlr4-python3-runtime` and `antlr-python-runtime`. Installing the wrong one causes hard-to-debug issues. As one user who ran into this issue pointed out,
   > That's a few lost hours for each of the two characters
2. The above issue is further exacerbated by the fact that the required package's name is `antlr4-python3-runtime` on PyPI.

In [#19528](https://github.com/sympy/sympy/issues/19528), [sylee957](https://github.com/sylee957) pointed out a few more shortcomings of the existing ANTLR-based parser:

1. The ANTLR generated files don't make the parser truly standalone.
2. The ANTLR generated files generate huge diffs when changes are made to the grammar files. ([Here is an example.](https://github.com/sympy/sympy/pull/23535/files))
3. The ANTLR generated files contain version information that cause warnings for the user. The good news is that in spite of the warnings, they appear to run without critical problems. However, this is bad for developers because different versions of ANTLR give differently structured script files, which exacerbates the problem mentioned above, of generating huge diffs.
4. The ANTLR generated files contain personal information, which must be filtered out before committing them to version control.

All of the above shortcomings are reasons to move away from ANTLR and towards a pure Python library.

One advantage of ANTLR is its performance, which [isn't that important for this use-case](https://github.com/sympy/sympy/issues/19528#issuecomment-662026674).

### Alternatives to ANTLR

There are multiple viable alternatives that were originally considered:

1. [lark](https://github.com/lark-parser/lark)
2. [tex2py](https://github.com/alvinwan/tex2py)
3. [parsimonius](https://github.com/erikrose/parsimonious)
4. [ply](https://github.com/dabeaz/ply)

Note that all the libraries in the list are Python libraries.

Of these libraries, Lark was chosen as the library that fits SymPy's needs best.

### Why Lark?

Numerous advantages to using Lark [were identified](https://github.com/sympy/sympy/issues/19528#issuecomment-662430318):

1. Lark has active, receptive maintainers. For example, when I found something in the documentation that wasn't being rendered correctly, I opened [an issue](https://github.com/lark-parser/lark/issues/1287) for it which was then promptly fixed.
2. Lark has good documentation. [The documentation](https://lark-parser.readthedocs.io/en/latest/grammar.html) is detailed and filled with examples, which makes using the library a lot easier.
3. Lark has no runtime dependencies beyond Python's standard library. This is important because, for example, Parsimonious still needs the external [regex](https://pypi.org/project/regex/) package.
4. Lark shows strong performance.
5. Lark handles ambiguities that PEG parsers cannot. By [using the Early parser](https://lark-parser.readthedocs.io/en/latest/parsers.html#earley), for example, Lark can return all a tree with all the possibilities if a certain expression is ambiguous.
6. Lark uses a dedicated, self-described format,
   - that cannot include implementation details (e.g. inline python). This is good because the library itself enforces separation of concerns (i.e. keeping the grammar definition separate from the parser).
   - which can be stored inline in a `.py` file, or
     - stored in one or more `.lark` files.
   - which has plugins for various editors. For example, there is a [VS Code extension](https://github.com/lark-parser/vscode-lark) and a [PyCharm plugin](https://github.com/lark-parser/intellij-syntax-highlighting) for syntax highlighting Lark files,
   - can be used to generate parsers in other languages like Julia and JavaScript (see the last point [here](https://lark-parser.readthedocs.io/en/latest/features.html#extra-features).)
7. has a "standard library" of useful tokens and expressions which can be imported into a grammar.
8. Lark can generate an standalone `.py` file. In this case, this is not a big advantage since one of the reasons for moving away from ANTLR was to remove compiled components.

## Prior Work

There was already some prior work done (before this GSoC project) in rewriting the LaTeX parser: In [#19825](https://github.com/sympy/sympy/pull/19825), [costrouc](https://github.com/costrouc) started working on removing the ANTLR-based parser and started implementing the Lark-based parser.

That’s all for this blog post! In this blog post, I tried to give the full history behind the LaTeX parser in SymPy, what the motivation for rewriting it in Lark was, and talked about where we stand currently. Stay tuned to this series for more information and for a work update on what I've done so far :grin:
