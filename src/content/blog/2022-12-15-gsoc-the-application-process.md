---
title:  "GSoC — The Application Process"
date:   2022-12-15 21:02:29 +0530
description: 'In this blog post, I will discuss what the application process for GSoC is like, and the timeline in which I did things and applied.'
image: https://media2.dev.to/dynamic/image/width=900,height=450,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F9kfay5ld90py6xtql220.png
tags: ['gsoc']
---

This post is aimed towards people who want to try out GSoC for the first time, and are new to Open Source. I assume no prior knowledge, other than a basic understanding of what GSoC is.

# Eligibility

Before starting on your GSoC journey, it makes sense to check if you are eligible, right? The good news is that if you are a college student in India, you are most likely eligible for GSoC.

The [GSoC FAQ](https://developers.google.com/open-source/gsoc/rules) states that

> * You must be at least 18 years of age when you register
> * You must be eligible to work in the country you will reside in during the program.
> * You must be an open source beginner or a student.
> * You have not been accepted as a GSoC Contributor/Student in GSoC more than once.
> * You must reside in a country that is not currently embargoed by the United States. See [Program Rules](https://developers.google.com/open-source/gsoc/rules) for more information.

Like the excerpt says, you can refer to the [Program Rules](https://summerofcode.withgoogle.com/rules) for a full description of everything relating to the program, in lawyer-y language.

## Changes in Eligibility Over Previous Years

Up until (but not including) 2022, the eligibility rules only allowed current students and recent graduates to apply for GSoC.

In November 2021, Google [announced a few changes](https://opensource.googleblog.com/2021/11/expanding-google-summer-of-code-in-2022.html) that would take place starting 2022. One of the key changes was that anyone above the age of 18 can now apply to GSoC:

> Beginning in 2022, we are opening the program up to all newcomers of open source that are 18 years and older. The program will no longer be solely focused on university students or recent graduates.

The immediate consequence of this change, for an aspiring GSoC applicant, is that the competition is more fierce due to the increased number of applicants.

However, there is nothing to fear! If you read this guide on the application process and follow the steps given here, you will have a pretty high chance of getting selected.

# Willingness to Learn Things

An oft-overlooked aspect to think about when applying to GSoC is your willingness to learn things. For example, are you willing to learn a new language to work with a specific organization? Are you willing to learn an entirely new topic to work on a specific project?

Let's say I know C++ but don't know Python. However, I am really interested in CASes (Computer Algebra Systems) and want to work on one. A great choice in this case would be SymPy, but it's in Python. In such a case, I might just learn Python for the express purpose of contributing to SymPy. (I might even backwards rationalize it later on by telling myself that Python is a popular language and that learning it allows me to work with ML libraries and image processing libraries :yum:)

However, I might not be that interested in CASes, and not willing to learn a new language. In that case, I would be limited to choosing an organization which has available projects in C++. If I am interested in compilers, I might want to contribute to [LLVM](https://summerofcode.withgoogle.com/programs/2022/organizations/llvm-compiler-infrastructure), and if I'm interested in OS development, I might look into working with [Haiku](https://summerofcode.withgoogle.com/programs/2022/organizations/haiku).

## My Experience

I knew C++ and Python before starting off on my GSoC journey, and I didn't have a preference for either language, as I view them as a means to an end. The two main organizations I looked at were [SymPy](https://summerofcode.withgoogle.com/programs/2022/organizations/sympy) and [CERN-HSF](https://summerofcode.withgoogle.com/programs/2022/organizations/cern-hsf). The former uses Python, while the latter primarily uses C++ for its projects (and languages like HTML5 for the web dev-oriented ones).

That being said, the CERN-HSF project I was most interested in had to do with SIMD, and knowledge about computer architecture in general would help a lot. I did not know these topics that well at the time, but I was willing to learn. Ultimately, [this was the project I was selected for](https://summerofcode.withgoogle.com/programs/2022/projects/H0ek5yGF), and I learned a lot about vectorization and computer architecture during the project.

# Choosing an Organization

The first step for applying to GSoC is to choose an Organization. To that end, the [official GSoC Student Guide](https://google.github.io/gsocguides/student/choosing-an-organization) does a great job explaining what to look for when choosing an organization.

Apart from the points mentioned in the Student Guide, here are some alternative factors you might base your decision upon:

* The programming languages they use. This is primarily for those who do not want a (programming) language barrier.
* What they do. This is primarily for people who want a behind-the-scenes look on how people achieve a certain task. For example, if I wanted a behind-the-scenes look on how Linux kernel development works, I might want to apply to [The Linux Foundation](https://summerofcode.withgoogle.com/programs/2022/organizations/the-linux-foundation).
* How interesting their projects are. This is for people for whom the organization does not matter too much.

In the end, I chose my organization based on how interested I was in the projects they had: I found [this project](https://hepsoftwarefoundation.org/gsoc/2022/proposal_Acts-vectorized-LA-backend.html) very interesting and wanted to help them make their math backend faster. For me, the fact that I was also getting to work with CERN was just an added bonus.

## How Do I Know That The Organization Will Come Next Year?

The short answer is that before the Organization List comes out (which is [February 22, 2023](https://developers.google.com/open-source/gsoc/timeline#february_22_-_1800_utc) for next year), you don't know for sure.

The best we can do is to check whether the Organization came in previous years. For example, SymPy has been a GSoC Organization every year since 2016. Based on this, we can reasonably infer that they will also come in 2023.

However, it is important to note that this is not a fool-proof method. Mozilla had been a GSoC organization every year between 2016-2020 (inclusive). However, 2021 onwards, they have not been a GSoC Organization.

The good news is that all is not lost if the organization does not come as a GSoC Organization. For starters, you can mention the work you did in that organization on your GSoC proposal, regardless of where you apply because it counts as prior Open Source experience (I mentioned my SymPy PRs in my CERN-HSF proposal), which increases the reviewers'[^reviewer] confidence in you. Moreover, the experience you gained while working with that organization carries over to any other open source organization.

Let's say that I start working with SymPy, and had to learn Git and GitHub to be an effective contributor. If SymPy does not come next year as a GSoC organization, and I end up applying to [OpenCV](https://summerofcode.withgoogle.com/programs/2022/organizations/opencv), which also uses GitHub, the knowledge I gained while working with SymPy did not go to waste because I already learned how Git and GitHub works.

## The Two Types of Organizations

There are two types of organizations; I like to call them PR-based[^pr] organizations and qualification task-based organizations. They work slightly differently.

### PR-based Organizations

These organizations primarily choose their GSoC students based on their prior work with the organizations, namely their PRs. To increase your chances of being selected, it is wise to start as early as possible, and get as many meaningful PRs in as possible.

Reviewers usually place a greater weightage on code PRs (i.e. PRs which actually make changes to the code) over documentation PRs (i.e. PRs which either fix typos in the documentation or add some documentation). That being said, documentation PRs are a great way to start contributing to an organization, as it can be less daunting than modifying the code.

Examples of popular PR-based organizations include

* [SymPy](https://github.com/sympy/sympy/wiki/GSoC-Student-Instructions)
* [SciPy](https://github.com/scipy/scipy/wiki/GSoC-2022-project-ideas)

#### Getting Started with PR-based Organizations

A question many people have is, "How do I get started with PRs if I have no prior experience?" The good news is that it's quite straightforward: Most projects have issues labeled "Easy to Fix" or "Good First Issue" or some variant of it. These are issues that the community has labeled as such for not requiring too much knowledge to fix.

For example,

1. [CPython](https://github.com/python/cpython) has the ["easy" tag](https://github.com/python/cpython/issues?q=is%3Aopen+is%3Aissue+label%3Aeasy)
2. [SymPy](https://github.com/sympy/sympy) has the ["Easy to Fix" tag](https://github.com/sympy/sympy/issues?q=is%3Aopen+is%3Aissue+label%3A%22Easy+to+Fix%22).
3. [SciPy](https://github.com/scipy/scipy) has the ["good first issue" tag](https://github.com/scipy/scipy/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).

### Qualification Task-based Organizations

If you wish to apply to one of these organizations, you typically have to email the mentor assigned to the project you are interested in (their contact details will be on the project page). After that, they will send you a qualification task, which is usually a smaller version of the actual project. After you are done with the task, you might have to write up a small report on your work (this varies from organization to organization), and send them the code.

An important thing to note is that you should not contact mentors from this organization before the Organization List for that year is released by Google. Qualification task organizations typically ask prospective contributors to wait until the List is released to avoid wasted effort.

These types of organizations choose their GSoC Contributors on the basis of how good the code is (in terms of coding style, clarity, descriptive comments) and how well the code does the required task.

Sometimes (but not all the time), reviewers also take how long you take to the assignment into account. Because of this, it is best to turn in the qualification task as soon as possible, without sacrificing the quality of your work.

Examples of qualification task-based organizations include

* [CERN-HSF](https://summerofcode.withgoogle.com/programs/2022/organizations/cern-hsf)
* [FFmpeg](https://summerofcode.withgoogle.com/programs/2022/organizations/ffmpeg)

#### My Experience

I emailed the mentors for both [this project (Vectorized Linear Algebra Backend)](https://hepsoftwarefoundation.org/gsoc/2022/proposal_Acts-vectorized-LA-backend.html) and [this project (Symplectic Integrators)](https://hepsoftwarefoundation.org/gsoc/2022/proposal_Geant4-Symplectic-integrators.html). I took 4 days on the qualification task for the first project, and 7 days on the qualification task for the second one.

My write-up for the Vectorized Linear Algebra Backend project can be found [here](https://docs.google.com/document/d/17zZFPpkaThDxDctZu2rRtgBGUXZWAUOBhoxgZ-6iwyo/edit?usp=sharing), and my write-up for the Symplectic Integrators project can be found [here](https://docs.google.com/document/d/1uPMF53IFITruSWTe2Kzr87Ux09wrrIV25iQMLL1c9xE/edit).

I ultimately got selected for the Vectorized Linear Algebra Backend project.

# Choosing a Project

So at this point, you probably have a specific organization in mind. (Or maybe not, if you are choosing your organization based on your project interest.)

## Changes Made in 2022

In 2022, Google [made a couple of changes](https://opensource.googleblog.com/2021/11/expanding-google-summer-of-code-in-2022.html) to the way projects work:

* Two project formats were introduced: medium length projects, which are expected to take approximately 175 hours of work, and long projects, which are expected to take approximately 350 hours of work. Long projects have a stipend that is twice that of the medium length projects.
* Project timeframes were made flexible:

  > You can spread the project out over a longer period of time and you can even switch to a longer timeframe mid-program if life happens. Rather than a mandatory 12-week program that runs from June – August with everyone required to finish their projects by the end of the 12th week, we are opening it up so mentors and their GSoC Contributors can decide together if they want to extend the deadline for the project up to 22 weeks.

## How Do I Choose?

The best way to narrow down the list of possibilities is to first choose what length of project you are fine with: If you are fine with a more intensive project, long projects might be the way to go. However, if you want to do a bit less work during the Coding Period, a medium length project might be the way to go.

Apart from these considerations, the [official GSoC Student guide](https://google.github.io/gsocguides/student/finding-the-right-project) does a great job of explaining how to choose the right project for you.

## How Do I Choose The Timeframe?

To start off, Google assumes that everyone will be working on the standard 12-week project timeframe, regardless of their project length. This means that people with long projects are expected to work twice as much per week as the people with the medium length project assuming that the timeframes are the same.

If you wish to modify the timeframe (to either extend or shorten it), you have to contact your mentor (after you are selected) and come to an agreement about the project length. Keep in mind that mentors may not always be willing to extend a project because they may have other responsibilities (like, say, teaching).

# Writing A Proposal

## What To Write?

Now that you have an Organization and project in mind, it is time to write the proposal. But what do you write in it?

The good news is that many organizations, like [SymPy](https://github.com/sympy/sympy/wiki/GSoC-Application-Template), have a specific template they want all applications to follow.

However, if the application you are applying to does not have such a template, you can always use the template from one of the aforementioned organizations and leave out the organization-specific bits :laughing:

In all seriousness, however, apart from the big things like a section on your previous experience and a proposed list of the GSoC timeline and the milestones you plan on hitting, the format of a GSoC proposal is quite flexible (assuming that your organization doesn't have a template).

## When To Write The Proposal?

Ideally, it would be best to have a proposal (for each project you are applying to) ready right before the student application period starts. That way, you can contact the project mentors for each project of interest with your proposal, get some feedback, and incorporate those changes in your proposal.

The only thing to remember is to make sure to get mentor feedback while writing the proposal. Doing so greatly increases your chances of being selected, and mentors often point out errors (spelling, grammar, etc.) and ask you to elaborate on points which they feel are important for the project. The latter makes your proposal stronger as a whole, so asking for mentor feedback is highly beneficial.

## My Experience

I started writing my proposal for the Vectorized Linear Algebra backend project on April 13<sup>th</sup>. For reference, GSoC application window for 2022 was from April 4<sup>th</sup> to April 19<sup>th</sup>. This was quite a bit later than the timeframe I am recommending :see_no_evil:

However, I made sure to get feedback from the mentors and incorporated those changes. I remember that I was asked to fix some grammar mistakes, and add a section explaining my reasoning for some of the ideas that I was proposing.

You can find my GSoC proposal [here](https://docs.google.com/document/d/1Ick3iDF_2bGbLiR-ZDGWnk06rrP64JBQG8Et4TccxRs/edit?usp=sharing).

# Timeline

Finally, what is the timeline at which a newcomer should do things?

The first thing to look at is the [published GSoC timeline](https://developers.google.com/open-source/gsoc/timeline) for the next year.

The three dates of interest are:

* the date that the accepted GSoC organizations are announced ([February 22<sup>nd</sup>, 2023](https://developers.google.com/open-source/gsoc/timeline#february_22_-_1800_utc) for next year). This is the day you can start contacting qualification-task based organizations if they were accepted.
* the date that GSoC application period starts ([March 20<sup>th</sup>, 2023](https://developers.google.com/open-source/gsoc/timeline#march_20_-_1800_utc) for next year). This is the day you should ideally have a first draft of your proposal ready, and start asking for mentor feedback.
* the date that the GSoC application period ends ([April 4<sup>th</sup>, 2023](https://developers.google.com/open-source/gsoc/timeline#april_4_-_1800_utc) for the next year). This is the day by which you should have submitted all your proposals on the portal, and overall be done with everything. **This is a hard deadline.**

## When Should I Start?

There is no hard and fast date by which you should start. That being said, there are still some tips I can share.

If it is your first time applying to GSoC and contributing to Open Source, the earlier you start, the better. There is no "too early" when it comes to Open Source contributions. In fact, starting early has many advantages:

* It allows you to learn Git and GitHub, and possibly a new language, with less pressure as the GSoC deadline is still very far away.
* It allows you to get used to the process and cadence of fixing bugs, opening PRs, and dealing with code reviews.
* It gives you a lot of time to get lots of PRs merged, which will increase your chances of getting accepted for GSoC.
* If you don't like your first choice of organization, you can still switch and experiment with multiple organizations before settling on one.
* It allows you to explore multiple submodules before settling on one. If we take the example of SymPy specifically, then starting early allows you to explore submodules like [`codegen`](https://github.com/sympy/sympy/tree/4801871259a1a8db27bae99f5ea4db109bb1320a/sympy/codegen) and [`integrals`](https://github.com/sympy/sympy/tree/4801871259a1a8db27bae99f5ea4db109bb1320a/sympy/integrals).

In terms of real time, October or November is a great time to start, but you can start a bit later too, like December or even January. The main difference between starting later and earlier, like I said before, is the amount of exploration you can do.

### My Experience

I originally planned to start early, but due to various circumstances (read: being lazy), I ended up starting out with SymPy PRs in mid-February.

Since I originally planned to work with SymPy, I spent a lot of time on SymPy until I came across CERN-HSF. After that, I contacted the mentors for the projects I was interested in and completed the qualification tasks given to me. Around halfway through these tasks, I decided to focus on CERN-HSF as I found those projects more interesting than the ones I was looking at for SymPy. Because of that, I stopped working on PRs for SymPy and redirected all my time and energy to CERN-HSF.

# Miscellaneous Tips

## Project Mentors

One small thing to keep in mind is that it may be difficult to find mentors for the project you are interested in. This is an uncommon but not impossible scenario. In such a case, you have no choice but to choose a different project to apply to, since it is not possible to complete a GSoC project without mentors.

In 2022, a highly qualified GSoC SymPy applicant was unable to find a mentor for the project that he wanted to work on, so he was not selected for GSoC. The story however, has a silver lining, as the creator of SymPy ([Ondřej Certik](https://ondrejcertik.com/)) took an interest in his proposal, and the applicant went on to work with him.

## GSoC Applicant Pre-requisites

Before applying to an Organization, make sure to read their application guideline closely.

Many GSoC Organizations require a prospective applicant to have an accepted PR before applying. For example, the [Python Software Foundation](https://web.archive.org/web/20231001162241/https://python-gsoc.org/psf_ideas.html) guidelines say

> dont [sic] forget to be accepted all students must make at least 1 pull request!

A similar statement can be found in the SciPy guidelines:

> Make a enhancement/bugfix/documentation fix -- it does not have to be a large PR, and it does not need to be related to your proposal. Doing so before applying for the GSoC is a hard requirement for SciPy. It helps everyone by providing some idea on how things would work during GSoC.

SymPy has a [Patch Requirement](https://github.com/sympy/sympy/wiki/GSoC-Application-Template#patch-requirement) as well:

> In addition to the written proposal, we require every GSoC applicant to write a patch and get it pushed into the main SymPy repo. Note: even if your project will primarily deal with another repo such as SymEngine or SymPy Live, you must have at least one patch in the [main SymPy repo](https://github.com/sympy/sympy).

## Organization-Specific Tips

The organizations I was planning on applying to were SymPy and CERN-HSF. For this reason, I am most knowledgeable about how these two organizations work. As such, I have some extra tips to share if you are planning to apply to one of these organizations:

1. Starting this year, CERN-HSF required all its contributors to also make a blog about their work and experiences during the GSoC period. These blogs can be found [here](https://hepsoftwarefoundation.org/gsoc/2022/blogs.html). These blogs should be useful if you are interested in working with CERN-HSF and to get an idea of our experiences.
2. If you are planning to apply to SymPy, around 6 or 7 accepted (code-related) PRs is the sweet-spot for ensuring a high probability of getting selected for GSoC.
3. Many SymPy GSoC Contributors also write a blog about their experience. (Here are [some](https://sumith1896.github.io/Google-Summer-Of-Code-with-SymPy) [examples](https://0sidharth.github.io/jekyll/2021/05/18/gsoc-acceptance/).) If you want to know what it's like to work with SymPy, you can read these blogs for more information.

## What Would I Have Done Differently?

The biggest thing I struggled with during my GSoC application period was time management. I consistently fell behind self-imposed schedules and did things close to the deadline. If I could redo it, I would make sure to leave lots of time at each stage of the journey by starting out with SymPy earlier, starting with the proposal writing earlier, etc.

[^pr]: PR is short for Pull Request. In case you don't know what those are, you can read more about them [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests).

[^reviewer]: The reviewer is the person who will be reading your proposal and ultimately deciding whether they want you as a GSoC Contributor or not. Often, there are multiple reviewers.
