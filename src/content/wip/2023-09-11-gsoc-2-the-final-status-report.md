---
layout: single 
title:  "GSoC 2 --- The Final Status Report"
date:   2023-09-11 21:57:13 +0530
classes: wide
toc: true
toc_sticky: true
usecodehl: true
usemathjax: true
usemermaid: true
custom_css: gsoc-2
header:
  image: /assets/images/gsoc/gsoc-logo-with-sympy-logo.png
  image_description: "A picture with the Google Summer of Code logo on the left and the SymPy logo on the right."
categories: gsoc sympy
---

In this post, I'll talk about all the work that I did in my second GSoC.

I had originally hoped to mimic the way I had written blog posts in my first GSoC: A three-part series, with an initial post, an intermediate post which would chronicle all the work that had been done up to the Midterm Evaluation, and then finally a final post which talks about the work that had done between the Midterm Evaluation and the Final Evaluation. The final blog post would also discuss future directions for the project, so that people who work on the work on the project after me would be able to easily extend the work I had done.

However, due to time constraints, I was quite busy, and I was unable to find the time to write an intermediate blog post, so I decided to skip that and go straight to the final blog post this time around.

In this blog post, I'll start off where the previous post left off, and then mention all the work I did in chronological order.

# False Starts

The original plan was to build off the work done by [costrouc](https://github.com/costrouc) in [#19825](https://github.com/sympy/sympy/pull/19825), and finish up the Lark port of the ANTLR-based parser.

There were three issues:

1. The PR removed the ANTLR-based $\mathrm{\LaTeX}$ parser completely, even though the Lark-based parser was still a WIP (work-in-progress) at the time.
2. Related to the first point, the commit history was a mess. There were commits which did many things at once.
3. This was more of an issue on my side, but the way the work had been done made it very hard to follow and made it really hard for me to make changes and modifications.

## First False Start

I started my GSoC off with [#25210](https://github.com/sympy/sympy/pull/25210), where I simply took the original PR, [#19825](https://github.com/sympy/sympy/pull/19825), and rebased the current `master` on top of the 3 year old branch.

Unfortunately, there were many _many_ merge conflicts when I rebased `master` on top of the branch. Fixing them took around an hour for me, and I ended up made a few mistakes while fixing merge conflicts. For example, I noticed that after my rebase, there was a `.travis.yml` file in the repo, which had previously been deleted in [#24239](https://github.com/sympy/sympy/pull/24239). So, this attempt was a non-starter.

When my GSoC mentor [Francesco Bonazzi](https://github.com/Upabjojr) looked over the work I had done in the first week during a meet, he noticed that the PR removed all the ANTLR-based parser support. He stressed that we should not remove what already works until we have a well-tested and feature-complete alternative. I mentioned that the original PR, [#19825](https://github.com/sympy/sympy/pull/19825), already removed all the ANTLR-based $\mathrm{\LaTeX}$ parser stuff, and I had not made this change; I was simply building off of the previous work.

After we looked at the commit history of [#19825](https://github.com/sympy/sympy/pull/19825), we realized that a `git cherry-pick` would not work because of the 2<sup>nd</sup> point I mentioned above: The commit history was a mess, and there were commits which did many things at once. For example, along with adding the initial scaffolding for the Lark based parser, he also removed some ANTLR-related files. Then, in another commit, he modified the documentation to mention the Lark-based parser instead of the ANTLR-based parser.

Thus, this branch was a false start. I started over on a new branch, which led to my...

## Second False Start

Initially, the work on this branch was going great: I had manually copied over the relevant files from [#19825](https://github.com/sympy/sympy/pull/19825), and manually added [costrouc](https://github.com/costrouc) as a coauthor in the commit. My mentor was also happy with this branch at first, as can be seen in [this comment on the PR](https://github.com/sympy/sympy/pull/25219#issuecomment-1584139950).

In [`56b4f46`](https://github.com/sympy/sympy/pull/25219/commits/56b4f46c487384d97de6e9129778f3c6dee579c6), I regenerated the standalone grammar file for Lark, which allowed SymPy users to use the parser without having Lark installed on their computer. This ended up being a mistake on my part, because as Aaron Meurer commented [in this comment](https://github.com/sympy/sympy/pull/25219#issuecomment-1585127737), the license that Lark used for its standalone grammar file was incompatible with SymPy's own BSD 3-clause license.

He was a little annoyed that I hadn't done my due diligence and gone through the relevant issues and discussions in the PRs before starting work on the project. After my faux pas, I made sure to go through the important issues related to my project like [#19528](https://github.com/sympy/sympy/issues/19528), [#14004](https://github.com/sympy/sympy/issues/14004), and the long discussion in [#13706](https://github.com/sympy/sympy/pull/13706), which is the PR that originally added the ANTLR-based parser to SymPy.

Work was going great on this PR until I realized that, for some mysterious reason, I couldn't add even simple things like allowing
`\ne` and `\ge` as alternatives for `\neq` and `\geq`. What was even weirder was the fact that when I tried out the same changes on my own branch, it worked.

Moreover, there was no rhyme or reason to which expressions were failing and which expressions were passing. For example, the partially-finished parser was able to parse `\binom{n}{k}` correctly, but was failing on `\binom{n}{0}`. Similarly, it was able to parse `2x` but was choking on `3x - 1`.

Hence, this attempt was also a non-starter, and I started another branch.

# The Real Work Begins

This time, I decided to start from scratch because there were some oddities in the previous work that were preventing me from making even simple changes. This new branch became PR [#25324](https://github.com/sympy/sympy/pull/25324) over time, which was eventually merged into `master`.

Making a baseline $\mathrm{\LaTeX}$ parser (with a bare minimum amount of features) turned out to be a lot of work, and I spent a significant portion of my GSoC period working on this one PR. I made sure to commit frequently and commit relatively small pieces of work so that things could be reverted if necessary, having learned from the difficulty I had in trying to continue [costrouc](https://github.com/costrouc)'s work.

## Humble Beginnings

As can be seen in commit [`7863b84`](https://github.com/sympy/sympy/pull/25324/commits/7863b841ceff4cd83c49bb7f05b5f64e4d45fcc4), this PR had truly humble origins. It only supported things like expressions with addition, subtraction, multiplication, division, and relations. The atoms on either side could only be integers or single-letter symbols. In essence, it only supported things like:

* $x + y$
* $3 * y$
* $z / 9$
* $3 < t$
* $x \geq y$

## Test Suite

I had learned from my previous GSoC that a big and extensive test suite can greatly simplify the development experience, especially when adding new features. For this reason, I added a test suite early in the PR. In commit [`1f5f790`](https://github.com/sympy/sympy/pull/25324/commits/1f5f790c573214d4b974cdb90ad91998e1500d09), I copied over the entire ANTLR test suite and ran it on the Lark parser.

Having the test suite had another benefit: I now had a concrete way of measuring my progress over time. As I added more and more to the Lark-based parser, fewer tests would fail and I could use this to quantify my progress per week and report back to Francesco.

## Adding Tokens

After that, I copied over the entire tokens list from [#19825](https://github.com/sympy/sympy/pull/19825). Even though its grammar and transformer code might have been impenetrable for me, its tokens list was correct and perfectly reusable. I also made sure to not reinvent the wheel and opted to use built-in tokens for integers and floats from the [common Lark token library](https://github.com/lark-parser/lark/blob/a2297d3d490705be64a497b47dae3fb1558542e9/lark/grammars/common.lark). I made these changes in [`2aa0a2e`](https://github.com/sympy/sympy/pull/25324/commits/2aa0a2ed71d7ee2a8ed83816e6d1b968163d41e2).

## First Team Meeting

I had a strong base set up, but I was unsure about how to continue and was dragging my feet. During one of the early team meetings, Francesco shared the brilliant idea of having the Lark grammar file closely match $\mathrm{\LaTeX}$'s syntax and the way it builds expressions, and then convert that into a SymPy expression in the transformer.

I was initially opposed to the idea, but I slowly came to see its merits. After that, I was able to increase my progress greatly and I added support for many things, like binomial expressions (added in [`50d7706`](https://github.com/sympy/sympy/pull/25324/commits/50d7706ab9120a311d0d5c1ac3237d1bb6140335)) and logarithms (added in [`465c905`](https://github.com/sympy/sympy/pull/25324/commits/465c905c268418ea333a3e2f318b3ea1ed014090)), most integral expressions (added in [`f966dab`](https://github.com/sympy/sympy/pull/25324/commits/f966dab3fc916489407deaae542b976f88b9d5c2)), and more.

## Hierarchy of Expressions

I soon ran into another issue: Rules for things like addition must be defined recursively. However, we were using the Earley parser, which tries all the possibilities and returns parse trees which match every possible interpretation of the grammar rules, when multiple such interpretations exist. This lead to many parse trees for simple things like addition and multiplication, even though all of them would return the same result ultimately.

My rule for addition was something like `add: expression ADD expression`. With an input expression like $a + b + c$, the parse trees will be something like

{% mermaid %}
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
{% endmermaid %}

where the first interpretation corresponds to $(a + b) + c$, and the second interpretation corresponds to $a + (b + c)$.

In general, in an expression with $n$ applications of a binary operator (like $+$ or $\times$), the number of possible interpretations is $C_n$, where $C_n$ is the [$n^\mathrm{th}$ Catalan number](https://en.wikipedia.org/wiki/Catalan_number#Applications_in_combinatorics).

The way to handle this is well-known within the parsing community, but when my mentor first demonstrated the idea, it blew my mind. The solution is so simple, and yet so profound: Use a hierarchy of expressions.

In essence, you first choose whether you want the expression to be left- or right-associative. Once you have made your choice, you make the other side of the expression something of higher priority.

For example, I wanted addition to be left-associative in the $\mathrm{\LaTeX}$ parser, which is a reasonable choice. After that, you make the right side of the `add` rule to have something like `expression_mul`, where `expression_mul` can only bind to things with a priority equal to or greater than that of multiplication.

This is an important idea to understand, because this idea was used liberally in the Lark-based $\mathrm{\LaTeX}$ parser. I will explore the idea in more detail in the upcoming blog post for the Lark-based $\mathrm{\LaTeX}$ parser's developer documentation. In that blog post, I will explain all the design choices I made while working on the parser, and share the rationale behind each choice.

## Testing Revisited

An important change I made was when I refactored the tests. In [`14fffa6`](https://github.com/sympy/sympy/pull/25324/commits/14fffa6e04d04e3622649d4e8d3d3adb789a0d85), I broke up the tests into many different functions, each of which stress tests the parser against a specific class of expressions.

There were multiple reasons I made the change:

1. Before the change, the entire test suite was in a list of tuples where the first element is the input $\mathrm{\LaTeX}$ string and the second element is the expected SymPy object. while this is a reasonable way to organize the tests overall, breaking up the test cases into separate categories and testing the $\mathrm{\LaTeX}$ parser against each category allows the developer to have a better understanding of where the parser is failing.
2. There was no rhyme or reason to where each test was placed. Before my change, the tests layout has most of its integral-related tests [here](https://github.com/sympy/sympy/blob/a9320ec9328d722417b5bcd3b5cd885ae2960eb1/sympy/parsing/tests/test_latex.py#L173-L192) with a lone integral test [here](https://github.com/sympy/sympy/blob/a9320ec9328d722417b5bcd3b5cd885ae2960eb1/sympy/parsing/tests/test_latex.py#L272).
3. Having one function for each type of test allows us to easily see which aspects of the parser are sufficiently tested, and which parts have barely any tests. For example, while I broke out the trigonometric function tests into its own function, I realized that things like `\sin^2 x` and hyperbolic functions like `\sinh x` are not tested at all.

## The Transformer Class

So far, I had only been working on shaping the parse tree that was generated from the input $\mathrm{\LaTeX}$. This was only half the battle: I needed to generate a parse tree from the input $\mathrm{\LaTeX}$ string, and then generate a SymPy expression from that.

The full test suite which I ported over from the ANTLR-based parser's test suite had 185 test expressions. Of them, the original PR was parsing and returning the correct SymPy expression for 60 test cases. Once I had surpassed the old PR in terms of number of passing tests, I started working on the transformer.

Even though the parse tree was correct for these tests, I still had to write the transformer which would walk the tree in a bottom-up fashion and generate the SymPy expression. So, I got to work on the transformer class and started filling in the nodes one by one.

Once I had most of the parse tree the way I wanted it, I folded many of the nodes for performance and because there was no need to write special code to handle them. I was first introduced to the idea of "folded nodes" by [this comment](https://github.com/sympy/sympy/pull/25219#discussion_r1223425725) in one of the false start PRs. I had kept this idea in mind the whole time because it would simplify the transformer greatly.

Any node which did not need special handling, like most of the `expression_*` nodes, were folded.

## Final Touches

After this, and a bunch of smaller changes like allowing Greek symbols and allowing subscripts for variable names, the PR was finally merged, which gave us a baseline implementation for the Lark-based $\mathrm{\LaTeX}$ parser in the SymPy repo.

# List of PRs Opened During GSoC

The rest of the work that went into the subsequent PRs to the Lark $\mathrm{\LaTeX}$ parser mainly added features which were lacking in [#25324](https://github.com/sympy/sympy/pull/25324).

I decided to not talk about them in this blog post because the exposition for those PRs would be dry reading, and because my explanations would mainly touch upon implementation details which are not of interest to anyone except prospective developers for the Lark $\mathrm{\LaTeX}$ parser.

## Parser-related PRs

During my GSoC period, most of my time went into working on the $\mathrm{\LaTeX}$ parser. However, I occasionally also worked on things which were not directly related to my GSoC project. I've separated all my work during the GSoC period into two categories based on their relevance to the $\mathrm{\LaTeX}$ parser.

<!-- markdownlint-disable MD033 -->
<div class="list-section">
  <ul>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25324">
        <span class="pr-list-item-icon"></span>
        #25324: Added a preliminary Lark $\mathrm{\LaTeX}$ parser implementation.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25515">
        <span class="pr-list-item-icon"></span>
        #25515: Removed <code>evaluate=False</code> from the Lark-based $\mathrm{\LaTeX}$ parser.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25535">
        <span class="pr-list-item-icon"></span>
        #25535: Refactored Transformer code and fixed a minor inconsistency.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25552">
        <span class="pr-list-item-icon"></span>
        #25552: Added support for <code>Min</code>, <code>Max</code>, <code>Bra</code>, and <code>Ket</code>.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25569">
        <span class="pr-list-item-icon"></span>
        #25269: Simplified Lark $\mathrm{\LaTeX}$ parser testing framework.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25622">
        <span class="pr-list-item-icon"></span>
        #25622: Added error messages to the Lark $\mathrm{\LaTeX}$ parser.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25626">
        <span class="pr-list-item-icon"></span>
        #25626: Made many miscellaneous improvements to Lark $\mathrm{\LaTeX}$ parser.
      </a>
    </li>
  </ul>
</div>
<!-- markdownlint-enable MD033 -->

### Breakdown

After the baseline implementation of the Lark-based $\mathrm{\LaTeX}$ parser was added to the mainline in [#25324](https://github.com/sympy/sympy/pull/25324), it was time to look at certain issues that had been raised about the $\mathrm{\LaTeX}$ parser and fix them.

To that end, [#24116](https://github.com/sympy/sympy/issues/24116) caught my eye, because it was an issue which had been stalled by the ongoing but incomplete work of creating the Lark-based $\mathrm{\LaTeX}$ parser. I had made it a point in my baseline implementation to deviate as little from the way the ANTLR implementation did things, save for certain quirks like allowing odd expressions like `{x + y}z`.

So, I made a PR which addressed [#24116](https://github.com/sympy/sympy/issues/24116) and changed the default behavior of the $\mathrm{\LaTeX}$ parser to be to evaluate everything unless told otherwise.

While working on the `evaluate=False` PR, there was a small issue which was pointed out. I was returning a Python `int` instead of a SymPy `Integer` for expressions that the $\mathrm{\LaTeX}$ parser flagged as integers. This was a mistake because we wanted to return native SymPy types as much as possible. Hence, [#25535](https://github.com/sympy/sympy/pull/25535) was born. I also took the opportunity to refactor the transformer out into its own file in that PR, since there was no reason for everything to be in `latex_parser.py`.

After that, I shifted my focus to adding new features to the Lark-based $\mathrm{\LaTeX}$ parser because most of the architectural changes had already been done, and things like the testing framework were decent for the time being. I added support for `Min`, `Max`, `Bra` and `Ket`. While the ANTLR parser already supported the latter two features, there was an issue [here](https://github.com/sympy/sympy/issues/19127) which asked for `Min` and `Max`. Since, in the Lark-based parser `Min` and `Max` could use the same scaffolding that applied functions (i.e. expressions like `f(x, y, z)`) use, I decided to add the feature.

Solving existing issues that were opened for the ANTLR-based parser in the Lark-based was a recurring theme in my GSoC journey, which I'll talk about in an [upcoming section](#list-of-issues-addressed).

After that PR, I noticed that many things which I was using in the tests were duplicated, so I opened [#25569](https://github.com/sympy/sympy/pull/25569) to minimize the amount of code duplication.

[#25622](https://github.com/sympy/sympy/pull/25622) added descriptive error messages to the Lark $\mathrm{\LaTeX}$ parser, which was something I had kept as a TODO in the very first PR. Overall, it was a pretty small change.

Finally, the last PR I made during the GSoC period was [#25626](https://github.com/sympy/sympy/pull/25626), which was a pretty substantial PR. I addressed many things which had been bugging me, and also incorporated suggestions like [the one in this comment](https://github.com/sympy/sympy/pull/25622#discussion_r1314247676) in the PR. I fixed many of the names (in variables and rules in the grammar, for example) that were bothering me and swapped them out for more appropriate ones. In addition that, I also added some important features that the ANTLR-based parser Lark $\mathrm{\LaTeX}$ parser was lacking, like derivatives, and integrals like

$$
I(x) = \int\limits_1^x \dfrac{\mathrm{d}t}{t}
$$

where the differential is in the numerator.

There were a bunch of other changes in [#25626](https://github.com/sympy/sympy/pull/25626) but they were implementation related, so I won't talk about them in this blog post.

## Miscellaneous PRs

This section lists all the PRs that I made which had no direct relevance to the $\mathrm{\LaTeX}$ parser.

<!-- markdownlint-disable MD033 -->
<div class="list-section">
  <ul>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25189">
        <span class="pr-list-item-icon"></span>
        #25189: Added a test for the unused array function parameter in the C code generator.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25205">
        <span class="pr-list-item-icon"></span>
        #25205: Fixed a small error in the docs.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25292">
        <span class="pr-list-item-icon"></span>
        #25292: Removed unnecessary code in MathML printer.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/pull/25295">
        <span class="pr-list-item-icon"></span>
        #25295: Added the logo to the SymPy documentation.
      </a>
    </li>
  </ul>
</div>
<!-- markdownlint-enable MD033 -->

### Breakdown

The first PR was something I found while going through old codegen related issues, and noticed that it was already fixed in `master`. I left a comment on the corresponding [issue](https://github.com/sympy/sympy/issues/16689), and was told that we could close the issue after I wrote a regression test to prevent this issue from reoccurring in the future, which is what I did in [#25189](https://github.com/sympy/sympy/pull/25189).

I was still looking at codegen issues at the time because I had enjoyed working on [#24954](https://github.com/sympy/sympy/pull/24954), and wanted to contribute to the codegen submodule a bit more.

After that, I submitted [#25205](https://github.com/sympy/sympy/pull/25205) because it was a very easy issue and it also allowed me to get familiar with the way the documentation works in SymPy. I knew that I would eventually have to write some documentation for the Lark-based $\mathrm{\LaTeX}$ parser, so I saw this as the perfect opportunity to get comfortable with the documentation workflow in SymPy.

The reason why [#25292](https://github.com/sympy/sympy/pull/25292) was made is because I was looking at the MathML printer due to some issue that had been raised, and I noticed that there was a hack to workaround a bug in the implementation of the `xml` module in the Python standard library. However, the Python versions that were affected by the bug were Python 3.2 and 3.3. Since the minimum version of Python that was supported at the time of the PR was 3.8, the fix was unnecessary now and removing the code simplified the MathML printer, so I removed it.

Finally, I submitted [#25295](https://github.com/sympy/sympy/pull/25295) because I myself needed to find the SymPy logo in order to create the cover image for this blog post and the previous one. Since there was no page in the SymPy docs with the logo, I had a difficult time finding it at first. When I came across the relevant [issue](https://github.com/sympy/sympy/issues/25275), I decided to make a PR for it so that others wouldn't have to struggle with finding the logo image.

# List of Issues Written and Addressed During GSoC

## List of Issues Written

At some point during the GSoC, my mentor asked me to open issues in the SymPy Issue Tracker so that we could keep track of all the progress and keep track of what's left to do in the project.

To that end, I opened a bunch of issues for different things: I opened some issues to keep track of the work that remained to be done in the testing infrastructure, features that needed to be added to the new $\mathrm{\LaTeX}$ parser, etc. I also opened a couple of issues to get the community's preference on certain things.

<!-- markdownlint-disable MD033 -->
<div class="list-section">
  <ul>
    <li>
      <a href="https://github.com/sympy/sympy/issues/25365">
        <span class="open-issue-list-item-icon"></span>
        #25365: Master Issue for my GSoC Project, <i>Rewriting the $\mathrm{\LaTeX}$ Parser in Lark</i>.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/25364">
        <span class="closed-issue-list-item-icon"></span>
        #25364: Adding features to the Lark $\mathrm{\LaTeX}$ Parser.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/25366">
        <span class="open-issue-list-item-icon"></span>
        #25366: Improve the $\mathrm{\LaTeX}$ Parser tests.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/25419">
        <span class="open-issue-list-item-icon"></span>
        #25419: <code>\leqq</code> and <code>\leqslant</code> for $\leq$, <code>\geqq</code> and <code>\geqslant</code> for $\geq$.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/25420">
        <span class="open-issue-list-item-icon"></span>
        #25420: Logarithm bases for <code>\lg</code> and <code>\log</code>.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/25482">
        <span class="open-issue-list-item-icon"></span>
        #25482: Ambiguous Expressions in the Lark-based $\mathrm{\LaTeX}$ Parser.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/25484">
        <span class="open-issue-list-item-icon"></span>
        #25484: Documenting the Lark $\mathrm{\LaTeX}$ Parser.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/25676">
        <span class="open-issue-list-item-icon"></span>
        #25676: Adding features to the Lark $\mathrm{\LaTeX}$ Parser.
      </a>
    </li>
  </ul>
</div>
<!-- markdownlint-enable MD033 -->

Since most of these issues are self-explanatory, I won't be adding a separate breakdown section. If any reader is interested in any of the issues, they can simply go and check out the issue, which will have a detailed description.

[#25364](https://github.com/sympy/sympy/issues/25364) and [#25676](https://github.com/sympy/sympy/issues/25676) have the same issue title because the former was written near the beginning of the project. As such, it is now outdated because many of the features listed have been implemented. For this reason, I created the latter issue to keep track of the features that are still not implemented.

## List of Issues Addressed

As I had mentioned above, solving existing issues that were opened for the ANTLR-based parser in the Lark-based was a recurring theme in my GSoC project. I used the following [search query](https://github.com/sympy/sympy/issues?q=is%3Aopen+is%3Aissue+label%3Aparsing.latex) on SymPy's GitHub issue tracker to find problems that people had found in the ANTLR-based parser, and I did my best to fix or address them in the Lark-based parser.

Here's a list of the things which are fixed in the Lark-based parser. Most of these issues are still not marked as resolved because they still exist in the ANTLR-based parser.

<!-- markdownlint-disable MD033 -->
<div class="list-section">
  <ul>
    <li>
      <a href="https://github.com/sympy/sympy/issues/19127">
        <span class="closed-issue-list-item-icon"></span>
        #19127: Please add <code>Min</code>, <code>Max</code> and <code>Abs</code> to $\mathrm{\LaTeX}$ capability.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/21517">
        <span class="closed-issue-list-item-icon"></span>
        #21517: <code>parse_latex</code> introduces unnecessary factor of $-1$.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/23551">
        <span class="closed-issue-list-item-icon"></span>
        #23551: Support parsing <code>\text</code> and <code>\mathrm</code> forms of differential operator.
      </a>
    </li>
    <li>
      <a href="https://github.com/sympy/sympy/issues/24290">
        <span class="closed-issue-list-item-icon"></span>
        #24290: Greek letters with indices are not considered on parsing latex.
      </a>
    </li>
  </ul>
</div>
<!-- markdownlint-enable MD033 -->

Once again, these issues are mostly self-explanatory so I won't add a separate breakdown section for this.

# Current State

The Lark-based $\mathrm{\LaTeX}$ parser has most of the features that the ANTLR-based parser did, and I fixed many of the bugs and problems that the ANTLR-based parser did.

There are a couple of things that could be improved upon, however.

## Ambiguous Expressions

The Lark parser has an issue with expressions like $f(x)$. The problem is that, a priori, it is not possible to tell whether, in an input string like `f(x)`, `f` is a variable name or a function. Technically, both interpretations are valid absent any other context. However, due to conventions, most people would interpret it as a function $f$ with an input $x$.

Currently, this is not handled in the Lark-based parser. A discussion about the best and most reasonable way to handle it needs to occur, and then changes need to be made.

When I brought this up, one of the solutions that were proposed were to set aside specific single-letter names like $f$, $g$, and $h$ exclusively for function names. While this is not the best solution, it would go quite far in terms of resolving most ambiguities of this nature correctly.

## Parsing $d$ correctly

Parsing $d$ either as a variable or a differential is a context-sensitive problem and something that is not suited to these parser generators, which work exclusively with CFGs (Context Free Grammars). As can be seen in [this issue](https://github.com/sympy/sympy/issues/22494), even the ANTLR-based parser was not free of this issue.

There have been solutions suggested, such as making $\mathrm{\LaTeX}$ parsing a two-pass process, among others.

# Future Work

I think that any future work mostly be directed towards handling the two issues I pointed out above. Another viable area which would benefit from further work is adding as much user customizability to the parser as possible, in a sensible fashion.

That's it for this blog post. Stay tuned for the next blog post, which will act as the developer documentation for the Lark-based $\mathrm{\LaTeX}$ parser.
