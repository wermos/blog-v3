---
layout: single
title:  "Baby's First Step Towards Genshin Theorycrafting"
date:   2023-01-14 17:44:25 +0530
classes: wide
toc: true
usemathjax: true
categories: genshin-impact theory-crafting
gallery1:
  - url: /assets/images/genshin/stats-cards/raiden-stats.png
    image_path: /assets/images/genshin/stats-cards/raiden-stats.png
    title: "My Raiden Shogun character stats."
  - url: /assets/images/genshin/stats-cards/albedo-stats.png
    image_path: /assets/images/genshin/stats-cards/albedo-stats.png
    title: "My Albedo character stats."
  - url: /assets/images/genshin/stats-cards/zhongli-stats.png
    image_path: /assets/images/genshin/stats-cards/zhongli-stats.png
    title: "My Zhongli character stats."
---

In this blog post, we will get our first taste of what theorycrafting in Genshin Impact looks like, and see some of the math that's involved.

# Calculating ATK, DEF, and Max HP

Before one can do anything theory-related, we must learn how to calculate the ATK, DEF, and Max HP of a character, because these stats affect how much damage a character does against enemies.

For the purpose of these tutorials and demonstrations, we will use three of my own characters and their builds. To see an enlarged version of a character card, just click on the one you want to see.

{% include gallery id="gallery1" caption="My Raiden Shogun, Albedo, and Zhongli stats." %}

## Conventions

We will use blackboard font letters to denote the total attack, defense, and Max HP of a character, respectively. That is,

$$
\newcommand{\A}{\mathbb{A}}
\newcommand{\D}{\mathbb{D}}
\newcommand{\H}{\mathbb{H}}
$$
$$
\newcommand{\charatk}{\alpha_{\text{char}}}
\newcommand{\weapatk}{\alpha_{\text{weap}}}
\newcommand{\percentatk}{\wp_{\scriptsize\text{ATK}}}
\newcommand{\flatatk}{\alpha_{\text{flat}}}
$$
$$
\newcommand{\chardef}{\delta_{\text{char}}}
\newcommand{\percentdef}{\wp_{\scriptsize\text{DEF}}}
\newcommand{\flatdef}{\delta_{\text{flat}}}
$$
$$
\newcommand{\charhp}{h_{\text{char}}}
\newcommand{\percenthp}{\wp_{\scriptsize\text{HP}}}
\newcommand{\flathp}{h_{\text{flat}}}
$$
$$
\begin{align*}
\A &= \text{Total Attack} \\
\D &= \text{Total Defense} \\
\H &= \text{Max HP}
\end{align*}
$$

Furthermore, we will use the following notation:
$$
\begin{equation*}
\begin{aligned}[c]
\charatk &= \text{Character's Base ATK} \\
\weapatk &= \text{Weapon's ATK} \\
\percentatk &= \text{ATK Percentage} \\
\flatatk &= \text{Flat ATK}
\end{aligned}
\qquad\qquad
\begin{aligned}[c]
\chardef &= \text{Character's Base DEF} \\
\percentdef &= \text{DEF Percentage} \\
\flatdef &= \text{Flat DEF}
\end{aligned}
\end{equation*}
$$

$$
\begin{align*}
\charhp &= \text{Character's Base HP} \\
\percenthp &= \text{HP Percentage} \\
\flathp &= \text{Flat HP}
\end{align*}
$$

### Motivation for Variable Names

I chose $\alpha$ for the ATK-related quantities because $\alpha$ is the Greek letter for "A", which is the first letter in the word "attack". Similarly, $\delta$ is the Greek letter for "D", which is the first letter in the word "defense".

For the English letter "H", there is no clear Greek counterpart, so I kept lowercase "h" for all the HP-related quantities.

## ATK Formula

Using the aforementioned notation, we have

$$
\begin{equation*}
\A = (1 + \percentatk)(\charatk + \weapatk) + \flatatk
\end{equation*}
$$

## DEF Formula

We have a similar formula for DEF:

$$
\begin{equation*}
\D = \chardef(1 + \percentdef) + \flatdef
\end{equation*}
$$

## Max HP Formula

The formula for Max HP is analogous to the DEF formula:

$$
\begin{equation*}
\H = \charhp(1 + \percenthp) + \flathp
\end{equation*}
$$

## Examples

### Example ATK Calculation

Let's calculate Raiden's ATK using the ATK formula. For ease of reference, I have put her character card below.

![Raiden Shogun's character card]({{ "/assets/images/genshin/stats-cards/raiden-stats.png" | relative_url }})

Substituting the formula with the numbers, we get

$$
\begin{align*}
\A &= (1 + \underbrace{0.466}_{\mathclap{\substack{\text{Sands} \\ \text{Main Stat}}}} + \underbrace{0.157}_{\mathclap{\substack{\text{Flower} \\ \text{Substat}}}} + \underbrace{0.163}_{\mathclap{\substack{\text{Feather} \\ \text{Substat}}}} + \underbrace{0.134}_{\mathclap{\substack{\text{Goblet} \\ \text{Substat}}}} + \underbrace{0.041}_{\mathclap{\substack{\text{Circlet} \\ \text{Substat}}}})\cdot (337 + 510) + \underbrace{311}_{\mathclap{\text{Feather}}} \\
&= 1971.967 \\
&\approx 1972
\end{align*}
$$

As we can see, our calculated value checks out with the ATK given in the character card.

### Example DEF Calculation

Now, let’s calculate Albedo’s DEF using the DEF formula. Once again, for ease of reference, I have put his character card below.

![Albedo's character card]({{ "/assets/images/genshin/stats-cards/albedo-stats.png" | relative_url }})

Substituting the formula with the numbers, we get

$$
\begin{align*}
\D &= 876\cdot (1 + \underbrace{0.690}_{\mathclap{\substack{\text{Weapon} \\ \text{Substat}}}} + \underbrace{0.583}_{\mathclap{\substack{\text{Sands} \\ \text{Main Stat}}}} + \underbrace{0.300}_{\mathclap{\substack{\text{2 pc. Husk} \\ \text{Bonus}}}} + \underbrace{0.109}_{\mathclap{\substack{\text{Flower} \\ \text{Substat}}}} + \underbrace{0.073}_{\mathclap{\substack{\text{Feather} \\ \text{Substat}}}} + \underbrace{0.241}_{\mathclap{\substack{\text{Goblet} \\ \text{Substat}}}} + \underbrace{0.255}_{\mathclap{\substack{\text{Circlet} \\ \text{Substat}}}}) + \underbrace{44}_{\mathclap{\substack{\text{Flower} \\ \text{Substat}}}} \\
&= 2891.876 \\
&\approx 2892
\end{align*}
$$

Once again, since our calculated value checks out with the DEF given in the character card, we can be sure that we did the correct calculations.

#### Albedo's DEF In Reality

Since I have him on the 4-piece Husk set, he gets an additional 24% DEF bonus when he has all 4 Curiosity stacks. This means that in real-world scenarios, his DEF is
$$
\begin{align*}
\D &= 876\cdot (1 + \underbrace{0.690}_{\mathclap{\substack{\text{Weapon} \\ \text{Substat}}}} + \underbrace{0.583}_{\mathclap{\substack{\text{Sands} \\ \text{Main Stat}}}} + \underbrace{0.678}_{\mathclap{\substack{\text{Artifact} \\ \text{Substats}}}} + \underbrace{0.300}_{\mathclap{\substack{\text{2 pc. Husk} \\ \text{Bonus}}}}  + \underbrace{0.240}_{\mathclap{\substack{\text{4 pc. Husk} \\ \text{Bonus}}}}) + \underbrace{44}_{\mathclap{\substack{\text{Flower} \\ \text{Substat}}}} \\
&= 3102.116 \\
&\approx 3102
\end{align*}
$$

This is consistent with the numbers which show up in the game.

### Example Max HP Calculation

Now, let’s calculate Zhongli’s Max HP using the formula. Once again, for ease of reference, I have put his character card below.

![Zhongli's character card]({{ "/assets/images/genshin/stats-cards/zhongli-stats.png" | relative_url }})

Note that the fact that he is using a level 70 weapon is okay because ATK has no bearing on Max HP.

Substituting the formula with the numbers, we get

$$
\begin{align*}
\H &= 14\, 695\cdot (1 + \underbrace{0.466}_{\mathclap{\substack{\text{Sands} \\ \text{Main Stat}}}} + \underbrace{0.466}_{\mathclap{\substack{\text{Goblet} \\ \text{Main Stat}}}} + \underbrace{0.466}_{\mathclap{\substack{\text{Circlet} \\ \text{Main Stat}}}} + \underbrace{0.200}_{\mathclap{\substack{\text{2 pc.} \\ \text{Tenacity} \\ \text{Bonus}}}} +\underbrace{0.0991}_{\mathclap{\substack{\text{Flower} \\ \text{Substat}}}} + \underbrace{0.0991}_{\mathclap{\substack{\text{Feather} \\ \text{Substat}}}}) + \underbrace{4\, 780}_{\mathclap{\substack{\text{Flower} \\ \text{Main Stat}}}} + \underbrace{1\, 105}_{\mathclap{\substack{\text{Feather} \\ \text{Substat}}}} + \underbrace{568}_{\mathclap{\substack{\text{Sands} \\ \text{Substat}}}} \\
&= 14\, 695\cdot (1 + 3\cdot 0.466 + 0.200 + 2\cdot 0.0991) + 6\, 453 \\
&= 47\, 543.159 \\
&\approx 47\, 543
\end{align*}
$$

Observe that our calculated value agrees with the number given in the character card.

Note that we used the value of $0.0991$ instead of the $0.099$ given in the character card. This is because of the way artifact substats are calculated, which we will take a deep-dive into in a future blog post. The extra $0.01\%$ is significant in this case because the value of the quantity we are calculating is in the $40$ thousands, so it _does_ actually make a difference. That being said, the difference it makes amounts to about $3$ HP :stuck_out_tongue_closed_eyes:
