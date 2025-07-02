---
title: 'GSoC — The Final Status Report'
date: 2022-11-21 20:19:56 +0530
description: 'In this blog post, I will describe the work I have done after the midterm evaluation.'
tags: ['gsoc', 'cern-hsf']
---

# Integrating Fastor

As I mentioned in the previous post, the next step was for me to fully integrate Fastor as a backend into `algebra-plugins`. To that end, I opened [PR #78](https://github.com/acts-project/algebra-plugins/pull/78).

## `algebra-plugins` Architecture

Integrating Fastor into `algebra-plugins` was not an easy feat. The architecture of `algebra-plugins` is quite complicated and very C++ template-heavy (in order to minimize code duplication). Moreover, there are many things which do not make sense to a beginner. For example, it is not immediately obvious to the newcomer why we need to write code both in the [`math` subdirectory](https://github.com/wermos/algebra-plugins/tree/9b3f0fe50d4be688ca99bd33e64e8837f6efa8f9/math) as well as the [`frontend` subdirectory](https://github.com/wermos/algebra-plugins/tree/9b3f0fe50d4be688ca99bd33e64e8837f6efa8f9/frontend). Moreover, the frontend names like `eigen_eigen` and `eigen_cmath` are not the most illuminating either.

### Uniform Function Names

Regardless, I got to work in the `math` subdirectory first. Inside this directory, all the functions used by the other projects and the rest of the repository are defined in terms of the math backend functions. A specific library might call the function `dot()`, [as Eigen does](https://eigen.tuxfamily.org/dox/classEigen_1_1MatrixBase.html#adfd32bf5fcf6ee603c924dde9bf7bc39), or it might call it `inner()` (short for [inner product](https://en.wikipedia.org/wiki/Dot_product)), [as Fastor does](https://github.com/romeric/Fastor/wiki/Linear-algebra-functions#inner-product-inner).

`algebra-plugins` uses the functions defined in the `math` directory to provide an uniform API, regardless of the backend. The name that was decided upon for `algebra-plugins` for this function was `dot()`.

### Uniform Type Names

Type names are another thing which have a lot of variation from library to library. Eigen calls their type as simply [`Matrix`](https://eigen.tuxfamily.org/dox/group__TutorialMatrixClass.html), whereas `SMatrix`, for example, calls their matrix type [`SMatrix`](https://root.cern.ch/doc/master/classROOT_1_1Math_1_1SMatrix.html) (unsurprisingly). For this reason, we have to define types such as `matrix_type` and `vector3` in the [`storage` directory](https://github.com/wermos/algebra-plugins/blob/9b3f0fe50d4be688ca99bd33e64e8837f6efa8f9/storage/fastor/include/algebra/storage/fastor.hpp).s

As I spent time mucking around in the `algebra-plugins` repository and writing code, these little things started to make more and more sense to me.

## Expression Templates

In order to understand how to write the code for Fastor in `algebra-plugins`, I spent time looking at how the code for the other backends was written. An important optimization that many math libraries use is [expression templates](https://en.wikipedia.org/wiki/Expression_templates). This is important because C++ is a eager evaluation language (as opposed to, say, Haskell, which uses lazy evaluation).

Imagine we have the line of code `auto result = 3 * v1 + 5 * v2;`, where `v1` and `v2` are vectors. If the expression were to be lazily evaluated, then every element of the resultant vector would not be computed until the whole expression had been read. In C++ (and other eager evaluation languages) what happens is as follows:

1. The subexpression `3 * v1` is read. Since this is something that can be computed, C++ computes it and puts it in temporary storage, say `temp1`.
2. The subexpression `5 * v2` is read. Once again, since this is something that can be computed, C++ computes it and puts it in temporary storage, say `temp2`.
3. The result of adding `temp1` and `temp2` is stored in `result`.

Obviously, a lot of unnecessary work is being done here. Expression Templates solve this issue by recording the work to be done in lightweight structs using templates until the expression needs to be evaluated, and only then does it fully evaluate the expression.

### Expression Templates and `algebra-plugins`

Because of expression templates, many functions have multiple definitions
