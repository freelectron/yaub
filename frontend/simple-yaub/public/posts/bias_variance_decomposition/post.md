<center>
    <h1> Bias-Variance Decomposition </h1>
</center>

$~$

$~$
## Why do we care? 🤔
$~$

The point of this exercise is to try to create an understanding of what
overfitting and underfitting mean in the context of machine learning.

$~$

$~$
## The Model Error ⚙️
$~$

Let's start by saying that it does really not matter what kind of machine learning model 
we want to evaluate a simple regression model, Variation Autoencoded,  transfformer model, Large Language model,
climate model of the Earth, or a model of the Universe. 
The principle stays the same - you want to predict an output given some input.
input. Imagine a scenario of the regression task just because the math for it is the easiest to do.
**Given** a dataset represented by i.i.d. pairs $x, y$,
i.e., observations of independent random variables that follow some (joint) statistical distribution, 
we can write the dataset as

$$ 
D=\left\{\left(x_1 ; y_1\right), \ldots, \left(x_n ; y_n\right)\right\}   .
$$

**We then want to** predict the expected target $\bar{y}(x)$ given an
observation (input) $x$

$$
\bar{y}(x) = \mathit{E}_{y|x}(y) = \int_{y} y p(y | x) d y  .
$$

**What we do** is use an algorithm $\mathrm{A}$ to arrive to a function
$h$ based on the data sample $D$

$$
{h}_{D} = \mathrm{A}(D)
$$

In our example, $\mathcal{A}$ could be any modelling technique, e.g.,
ANN, SVM, OLS regression, with its hyperparameter values. Then,
$h_D$ is a resulting (trained) model, i.e., model hypothesis.
In order to judge the quality of our trained model we want to compare it
to the "true\" observed values from the population described by the
function $\rho$. Thus, **our evaluation function** becomes the
expected/mean squared error

$$
\mathit{E}_{x, y \sim \rho}\left[\left(h_D(x)-y\right)^2\right]=\iint_{x y} p_{x,y} \cdot \left(h_D(x)-y\right)^2 d x d y
$$

where $\left\{p_{x, y}=Pr(x, y)\right\}$. The caveat is that we usually do not have access to the generative function $\rho$.
Therefore, we have to evaluate our models based on the already sampled
dataset $D$, i.e., subdivide it into the training and test sets.  

$~$

If we could sample infinitely many datasets $D$, we would have a model $\bar{h}$ such that
$$
\bar{h}=\mathit{E}_{D \sim \rho^{(n)}}[\mathit{A}(D)]=\int h_D \cdot \operatorname{Pr}(D) d D  . 
$$

In other words, if we had infinite time to sample and observe infinitely
many data samples $D$ from the population, and at the same time run/train the algorithm $\mathit{A}$ with them,
we would have arrived to the best possible model $\bar{h}$. We cannot do better than $\bar{h}$ 
which is our "expected function\" given $\mathit{A}$.

$~$

The variable $D$ becomes just another random variable in our analysis
if we can condition on it. We can thus apply the expectation operator
over $D$ and do all sort of crazy things. Speaking of crazy things,
let's rewrite our expected error as if we trained and evaluated our
model on infinitely many dataset $D$ of size $n$ sampled from the
underlying $\rho$

$$
\mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}}\left[ \left(h_D(x)-y\right)^2\right]
=\int_D^{} \int_x^{} \int_y^{} \left(h_D(x)-y\right)^2 \cdot p(x, y) p(D) d x d y d D \ .
$$

Won't you agree that if we were to integrate over all possible
combinations of $x, y, D$, we would know how good our model selection
algorithm $\mathit{A}$ really is? Let's see if we can decompose this
error into several components. We can do a few cheeky-mathy tricks, for example, 
represent the error using some \"stable\" or, better said, training-set-independent
functions $\bar{h}$ and later $\bar{y}$. Begin by

$$
\begin{align}
\mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}}\left[\left(h_D(x)-y\right)^2\right]
&= \mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}}\left[\left(\left(h_D(x)-\bar{h}(x)\right)+\left(\bar{h}(x) -y\right)\right)^2\right]  \\
&= \mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}} \left[ \left(h_D(x)-\bar{h}(x)\right)^2 \right] + \mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}} \left[ \left(\bar{h}(x) - y\right)^2 \right] + \\
& 2 \mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}}\left[\left(\left(h_D(x)-\bar{h}(x)\right) \cdot \left(\bar{h}(x) -y\right)\right)\right]
\end{align}
$$

where,

$$
\begin{align}
 \mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}}\left[\left(\left(h_D(x)-\bar{h}(x)\right) \cdot \left(\bar{h}(x) -y\right)\right)\right] &= \mathit{E}_{\substack{x, y \sim \rho}} 
    \left[ \mathit{E}_{\substack{D \sim \rho^{(n)}}}  
        \left(\left(h_D(x)-\bar{h}(x)\right) \cdot \left(\bar{h}(x) -y\right)\right)
    \right] \\
  &=  \mathit{E}_{\substack{x, y \sim \rho}} \left[ c \cdot \mathit{E}_{\substack{D \sim \rho^{(n)}}}  
    [h_D(x)] - \bar{h}(x)
  \right]\end{align}
$$

because $\left(\bar{h}(x) - y\right) = c$ as both $\bar{h}(x)$ and $y$ are
independent of the training dataset $D$. Reminder, $x, y$ belong to the
\"evaluation\"/test here.

Look further and see that

$$
\begin{align}
 \mathit{E}_{\substack{D \sim \rho^{(n)}}}  
    [h_D(x)] = \bar{h}(x)  \text{ \{ per definition \} }. 
\end{align}
$$

Thus,

$$
\begin{align}
  \mathit{E}_{\substack{x, y \sim \rho}} \left[ \bar{h}(x) - \bar{h}(x) 
  \right] = 0
\end{align}
$$

and the semi-final expected error becomes,

$$
\begin{align}
  \mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}}\left[\left(h_D(x)-y\right)^2\right]  
  &= \mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}} \left[ \left(h_D(x)-\bar{h}(x)\right)^2 \right] + \mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}} \left[ \left(\bar{h}(x) - y\right)^2 \right] + 0 
\end{align}
$$

Let's look at the most right term. Note, it is independent of $D$ again. What we can do is 

$$
\begin{align}
\mathit{E}_{\substack{x, y \sim \rho}}\left[(\bar{h}(x)-y)^2\right] &= \mathit{E}_{x, y}\left[(\bar{h}(x)-\bar{y}(x)+\bar{y}(x)-y)^2\right] \\
&= \mathit{E}_{x, y}\left[(\bar{h}(x)-\bar{y}(x))^2\right] + \mathit{E}_{x, y}\left[(\bar{y}(x) - y)^2\right]  + \\ & + 2 \mathit{E}_{x, y}[(\bar{h}(x)-\bar{y}(x)) \cdot (\bar{y}(x)-y)] 
\end{align}
$$

But also

$$
\begin{align}
2 \mathit{E}_{x, y}[(\bar{h}(x)-\bar{y}(x)) \cdot (\bar{y}(x)-y(x))] &= 2 \mathit{E}_{x, y}[(\bar{y}(x)-y) \cdot c] 
\\ & \text{ \{ since $(\bar{h}(x)-\bar{y}(x))$ is independent of $y$ \} } \\
 &= 2 \mathit{E}_x\left[\mathit{E}_{y | x}[(\bar{y}(x)-y) \cdot c]\right] \\
 &= 2  \mathit{E}_x\left[c \cdot\left(\mathit{E}_{y | x}[\bar{y}(x)]-\mathit{E}_{y | x}[y]\right)\right] \\
 & \text{ \{ } \mathit{E}_{y | x}[\bar{y}(x)] \text{is independent of $y | x$ and } \\ & \mathit{E}_{y | x}[y] \text{ is just } \bar{y}(x) \text{ \} }
\end{align}
$$

Thus,

$$
\begin{align}
\mathit{E}_{\substack{x, y \sim \rho}}\left[(\bar{h}(x)-y)^2\right]
&= \mathit{E}_{x, y}\left[(\bar{h}(x)-\bar{y}(x))^2\right] + \mathit{E}_{x, y}\left[(\bar{y}(x) - y)^2\right] 
\end{align}
$$

Combining everything together

$$
\begin{align}
\mathit{E}_{\substack{(x, y) \sim \rho \\ D  \sim \rho^{(n)}}}\left[\left(h_D(x)-y\right)^2\right] &= \underbrace{{\mathit{E}_{\substack{x, y \sim \rho \\ D \sim \rho^{(n)}}} \left[ \left(h_D(x)-\bar{h}(x)\right)^2 \right]}}_\text{variance} + \underbrace{\mathit{E}_{x, y}\left[(\bar{h}(x)-\bar{y}(x))^2\right]}_\text{bias} + \\ & + \underbrace{\mathit{E}_{x, y}\left[(\bar{y}(x) - y)^2\right]}_\text{noise} , 
\end{align}
$$

and oh my, oh [my](https://youtu.be/ikllVKppHRE), what do we have here.. We see that variance component is the only one dependent on the dataset, i.e., 
what dataset we sampled and how large it is ($n$). Variance is
saying \"given a training/testing dataset $D$ and a point $x$, how much
on average will our predictions vary from the predictions of the best
possible model allowed by $\mathit{A}$\". We want our algorithm $\mathit{A}$
to be able to generalise well across all $D$'s that can be drawn, thus a high
variance is [no
bueno](https://www.memecreator.org/static/images/memes/4801156.jpg). Next, the bias term includes the true target function $\bar{y}$ and
essentially shows what our average error between the best estimator
$\bar{h}$ and the true values $\bar{y}$ is. Said differently: how much our
algo $\mathit{A}$ is biased towards some other explanation that is not
in the data. Well, as for the noise term. Bad news, we will never know what it
is...

$~$

$~$
## The Trade-off ⚖️
$~$

Why does bias increase when you reduce variance and vice versa? 
That is not clearly shown by the last formula we drew out. 
An intuitive explanation would be: the larger your hypothesis pool (more
options of choosing $h_D$), the more likely you are to be close to the
true function (global minima of the error) but you are also more likely to
arrive to a different variation of the model hypothesis given a single
sampled dataset (since you have more parameters to tune, more degrees of
freedom). Figure 1 tries to illustrate this point. An
inflexible model can only have a \"simple\" form that is likely to miss
the true underlying target function, but it will always stay within a
small area of its hypothesis set. While a flexible, highly non-linear
model is more likely to capture the true, possibly, very complex
function, but because the algo $\mathit{A}$ will be \"choosing\" a model
from such a variety, it will be very dependent on the $D$ that it gets.

<p align="center" id="fig:trade_off_intuitive">
    <br>
    <strong> Figure 1: Trade-off between Bias and Variance </strong>
    <br>
    <img width="500" height="250" src="/posts/bias_variance_decomposition/pics/trade_off2.png">
    <br>
    <br>
</p>

https://www.cs.cornell.edu/courses/cs4780/2018fa/lectures/lecturenote12.html

For a more practical example of bias-variance inverse relationship with
a $sin$ function approximation, you can watch
[this](https://www.youtube.com/watch?v=zrEyxfl2-a8) video.
Unfortunately, I could not find or come up with a derivation or proof of this trade-off
relationship. I would very much appreciate if someone can point me to
one.

$~$

$~$
## The Regimes ↗️ ↘️
$~$

Hopefully, the seed of intuition behind bias and variance, and their connection, is
planted. As a result of this relationship, we have to two common cases, or "regimes" when we train a model.
Figure 2  attempts to show what regularly happens with the train and test error in practice.

<p align="center" id="fig:test_train_error">
    <br>
    <strong> Figure 2: Two common Bias-Variance regimes </strong>
    <br>
  <img width="500" height="250" src="/posts/bias_variance_decomposition/pics/test_train_error.png">
    <br>
    <br>
</p>

Case #1 is when we trained a model and end up with a low training error
while our test error is high. This means that $\mathit{A}$ was able to
choose an approximation that is flexible and fitted a sample well. But
the evaluation on another (test set) sample showed that the model was
not general enough.

In Case #2 our training error was higher than an acceptable threshold
and we did not capture the complexity of the training dataset that well.
Nonetheless, our test error is now close to the acceptable level meaning
that implicit assumptions that were made during training might result in
better generalisation.

$~$

When modeling it is important to strike a balance between bias and variance to achieve a model that is most likely to generalise well.
Here are some tips:

<p align="center" id="fig:test_train_error">
    <br>
    <strong> Figure 3: Dealing with The Trade </strong>
    <br>
  <img width="500" height="450" src="/posts/bias_variance_decomposition/pics/regimes3.png">
    <br>
    <br>
</p>

It is often said that the Regime #2 is when we do not have enough
power in the model. It lacks \"range\" and cannot capture the
relationships between $x$ and $y$ well so it ends up making
simplifying assumptions. Our error is then high due to high bias.

The Regime #1 is when error due to the variance component prevails. Then, the data is
fitted well on the training dataset but when evaluated on a different
sample, a high error is returned. That is a trait of high variance since our
model was \"too niche\" to generalise well.

$~$

$~$
## References 📜
$~$
-   [Analogous derivation](https://www.cs.cornell.edu/courses/cs4780/2018fa/lectures/lecturenote12.html8)
    
-   [Trade-off explained](https://www.youtube.com/watch?v=zrEyxfl2-a8)

-   [Nice blog with illustrations](https://mlu-explain.github.io/bias-variance/)

-   Nice math read: Elements of Statistical Learning (Chapter 7.3 in 2nd
    edition, Jan 2017)
