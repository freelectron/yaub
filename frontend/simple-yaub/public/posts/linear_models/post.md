<center>
    <h1> Linear Models & Intro to Kernels  </h1>
</center>

$~$

$~$
## Why do we care? 🤔
$~$

The workhorse of data modeling in many industries is still a linear model. If a such
company applies it somehow on their data, then in 90% of the cases
they are confidently bragging online that
"we are utilising Machine learning and AI\". Well, a linear model is a beautiful, simple and powerful tool,
and as experience comes you are more eager to use it rather than an advanced transformer-based-state-of-the-art "monster".

Equally beautiful is a kernel model. Though, kernel models have slightly fallen from grace in
the past few decades because of their scaling issues (read, can be slow on very large datasets), 
they are still a must-have tool for anybody working in ML.

Both of those tool rely heavily on probability theory so we start there.

$~$

$~$
## Exponential Family of Probability Distributions 🎲
$~$

The exponential family of distributions can be applied in a wide-range of scenario and
it is one of the easiest (if not the easiest) to use. 
A large number of common modeling tools is based on it.

$~$

$~$
### Bernoulli
$~$

I heard somewhere a person referring to a Bernoulli distribution as a
"damaged coin\" distribution. It tries to predict the likelihood of a
coin flip landing heads or tails, i.e., some binary event $x$. Thus, if
a coin shines heads we win and have a success $x=1$, otherwise, we lose
and it is $x=0$. Since the coin is damaged, we cannot assume that the
probability of it landing heads/tails is 50/50. The parameter $\mu$
describes the probability of $x=1$: 

$$
\begin{align}
p(x=1 \mid \mu)=\mu \quad \& \quad p(x=0 \mid \mu)=1-\mu \ . 
\end{align}
$$

Since the two outcomes are mutually exclusive, we can easily combine
their probabilities into a formula for both cases $x=1$ and $x=0$

$$
\begin{align}
{Bern}(x \mid \mu)=\mu^x(1-\mu)^{1-x}
\end{align}
$$

If we had to bet our money on a coin flip, we would want to see how
likely each event is, i.e., estimate $\mu$. We could base our estimation
on a data sample $D = [x_1 ... x_N]$ of independent and identically
distributed random events. In other words, we would want to find the
likelihood that $D$ occurred under $\mu$ 

$$
\begin{align}
p(D \mid \mu)=\prod_{n=1}^N p(x_n(\mu))=\prod_{n=1}^N \mu^{x_n}(1-\mu)^{1-x_n} \ .
\end{align}
$$

The maximum likelihood estimator of $\mu$ is determined by maximizing
the probability of sample data occurring,i.e., finding the most likely
parameter that could produce this data sample. The estimation of $\mu$
can be then via the maximum likelihood: 

$$
\begin{align}
{\underset{\mu}{\operatorname{argmax \ }}} p(D | \mu) \equiv {\underset{\mu}{\operatorname{argmax \ }}}  \ln \ p(D | \mu) 
\end{align}
$$

$~$

$~$
### Binomial\*
$~$
 
This (*) distribution is not in the exponential family but it is a generalisation of the Bernoulli distribution.
PLus, under certain condition it can be rewritten in the exponential form.

$~$

Let's consider now that instead of a single coin flip we count the number of
successes $m$ we get out of $N$ flips: 

$$
\begin{align}
{Bin}(m \mid N, \mu)=\binom{N}{m} \mu^m(1-\mu)^{N-m} \\
\text{where} \binom{N}{m}=\frac{N!}{(N-m)!m!}
\end{align}
$$

Then, if we had $k$ trials of flipping a coin $N$ and observing $m_i$
successes, estimating $\mu$ can be done with the maximum likelihood
${\underset{\mu}{\operatorname{argmax \ }}} p(D | N, \mu)$ where

$$
\begin{align} 
P(D | N, \mu)=\prod_{i=1}^k p\left(m_i | N, \mu\right) = \prod_{i=1}^k \operatorname{Bin}\left(m_i | N, \mu\right)=\prod_{i=1}^k\binom{N}{m_i} \mu^{m_i}(1-\mu)^{N-m_i} \ .
\end{align}
$$

$~$

$~$
### Gamma
$~$

Gamma distribution is often used to describe a continues variable that
is always positive and has skewness in its distribution frequency. It is
parameterised with $\alpha > 0$ and $\beta > 0$ to control shape and
thickness of the probability density function. 

$$
\begin{align} 
\begin{align}
&\begin{align}
& y-\operatorname{Ganma}(\alpha, \beta) \\
& p(y \mid \alpha, \beta)=\beta^\alpha y^{\alpha-1} e^{-\beta y} \frac{1}{\Gamma(\alpha)} \ .
\end{align}\\
&\Gamma(\alpha)=\int^{\infty} x^{\alpha-1} e^{-x} d x
\end{align}
\end{align}
$$

Parameter $\alpha$ controls the shape/skewness of the density
function. A common use case for the Gamma distribution is modeling the
wait time until $\alpha$-th event occurs. Parameter $\beta$ stretches or
compresses the distribution horizontally. Larger values of $\beta$
spread out the distribution, while smaller values concentrate it closer
to zero.

$~$

The Gamma distribution is closely related to Exponential distribution
and Chi-Squared distribution where the later are special cases of Gamma.

The gamma function can be seen as an extension of the factorial function
but for positive-real (and complex) numbers. It pretty much interpolates
the common factorial function for integers making the function line
smooth (and silky).

$~$

$~$
### Poisson
$~$

Models the number of occurrences of an event in a given unit of time,
distance, area or volume. For example, number of accidents in a day or
number of fruits/plants grown on a squared meter of land. The necessary
conditions for the Poisson probability distribution is that the events
occur independently and the probability of an event does not vary with
time. 

$$
\begin{align} 
x \sim Poisson (\lambda) \\
P(x \mid \lambda)=\frac{\lambda^x e^{-\lambda}}{x!}
\end{align}
$$

$~$

$~$
### Beta 
$~$

The Beta distribution is very frequently used in machine learning for it
is perfectly suited to represent percentages, proportions or
probabilities since its domain is restricted from 0 to 1.

$$
\begin{align} 
{Beta}(\mu \mid a, b)=\frac{\Gamma(a+b)}{\Gamma(a) \Gamma(b)} \mu^{a-1}(1-\mu)^{b-1}
\end{align}
$$

where bot $a$ and $b$ change the shape of the probability density
function.

$~$

This distribution is so used because its nice property of being a
fabulous conjugate prior. A little demonstration follows. Given the **Bayes' rule** 

$$
\begin{align} 
p(\mu \mid D)=\frac{p(D \mid \mu) p(\mu)}{P(D)} = \frac{p(D \mid \mu) p(\mu)}{\int_\mu p(D | \mu) p(\mu) d \mu} 
\end{align}
$$ 

where $D$ is the all the previous knowledge (e.g.,
parameters, observations) that we have acquired from the past data
sample(s). If we wanted to do estimation of our posterior the following would
hold: 

$$
\begin{align} 
p(\mu \mid D) \propto p(D \mid \mu) P(\mu) \ . 
\end{align}
$$

Remember that the Binomial's distribution parameter $\mu$ is the
probability of $m$ successes in $N$ trials and constrained to the range
$[0,1]$. What if we wanted to estimate the parameter $\mu$ with just a
single experiment observation $(m,N)$-pair but also had a prior
information that $\mu$ follows a Beta distribution. 

$$
\begin{align} 
\begin{gathered}
\{l=N-m\} \\
p(D|\mu) = Bin(m \mid N, \mu)= \binom{N}{m} \mu^m(1-\mu)^l  \text{\ \ \ (likelihood) } \\
p(\mu) = {Beta}(\mu \mid a, b) = \frac{\Gamma(a+b)}{\Gamma(a) \Gamma(b)} \mu^{a-1}(1-\mu)^{b-1} \text{\ \ \ (prior)}
\end{gathered}
\end{align}
$$

Then, following the Equation 17

$$
\begin{align} 
p\left(\mu \mid D = (m, l, a, b)\right) &\propto \binom{N}{m} \mu^m(1-\mu)^l \cdot \frac{\Gamma(a+b)}{\Gamma(a) \Gamma(b)} \mu^{a-1} \cdot(1-\mu)^{b-1} \\
& \text{\{skipping the coefficient for Beta prior as it does not depend on\ } \mu \} \\
& \propto\binom{N}{m} \mu^{m+a-1}(1-\mu)^{l+b-1} \\
& \text{\{skipping the binomial coefficient as it does not depend on\ } \mu \} \\
& \propto \mu^{m+a-1}(1-\mu)^{l+b-1}
\end{align}
$$

The last equation looks like a non-normalised Beta distribution, i.e.,
functional form of $Beta(\mu | m+a, l+b)$ can already be seen. We can
add the normalisation constant to make it a proper distribution.
Finally, 

$$
\begin{align} 
p(\mu \mid D) = Beta(\mu | m+a, l+b) = p(\mu \mid m, l, a, b)=\frac{\Gamma(m+a+l+b)}{\Gamma(m+a) \cdot \Gamma(l+b)} \mu^{m+a-1}(1-\mu)^{l+b-1}
\end{align}
$$

Note that we have gotten a full distribution for $\mu$ instead of just a
single estimate as was the case for the maximum likelihood estimator.
However, this posterior distribution could also be used to produce a
point estimate for $\mu$ by calculating its mean or mode.

$~$

If we were to make predictions based on the data and the prior, we can
calculate the variance of $\mu$ to access uncertainty about the
estimator and our future predictions. Optionally, we can also sample
from the posterior distribution to have a whole range of possible values
for the next prediction phase. Then, we would use the posterior predictive
distribution 

$$
\begin{align} 
p(\hat{m} \mid D)=\int p(\hat{m} \mid \mu) p(\mu \mid D) d \mu
\end{align}
$$ 

where we can sample from each time we want to produce a
possible value for the next observation $\hat{m}$. If you work out the
integral, the predictive distribution is actually the expectation of
$p(\mu \mid D)$ 

$$
\begin{align} 
p(\hat{m} \mid D)=\mathbb{E}_{\mu \mid D}[p(\hat{m} \mid \mu)]  \ .
\end{align}
$$

$~$

$~$
### Multinomial
$~$

The next distribution describes a vector $\vec{x} \in \mathbb{R}^k$
where 1 of $k$ elements is 1 and the rest are 0's, or 

$$
\begin{align} 
& \vec{x}=(0,0,0,1,0,0)^{\top} \\
& \text { \& } \sum_{i=1}^k x_i=1 \ .
\end{align}
$$

We can describe the probability of each $\vec{x}$ by generalising the
Bernoulli distribution to more than two variables 

$$
\begin{align} 
p(\vec{x} \mid \vec{\mu})=\prod_{i=1}^K \mu_i^{x_i} \\
\vec{\mu}=\left(\mu_{1 n} \ldots, \mu_k\right)^{\top} \\ 
\mu_i \geq 0 \text{ \ \& \ }  \sum_{i=1}^k \mu_i=1 \ . 
\end{align}
$$

The expectation of $\vec{x}$ is then 

$$
\begin{align} 
\mathbb{E}[\vec{x} \mid \vec{\mu}]=\sum_{\vec{x}} p(\vec{x} | \vec{\mu}) \vec{x}=\left(\mu_{1},  \ldots, \mu_k\right)^{\top}=\vec{\mu} \ . 
\end{align}
$$

The likelihood of $N$ i.i.d. vectors $\vec{x}$ is 

$$
\begin{align} 
p(D \mid \vec{\mu} ) &= \prod_{n=1}^N \prod_{i=1}^K \mu_i^{x_{n, i}} = \prod_{i=1}^K \mu_i^{(\sum_{n}^N x_{n i})} = \\
& = \prod_{i=1}^K \mu_i^{m_i}
\end{align}
$$ 

where $m_i$ is the number of observations where $x_i$
= 1. For each dimension $i$ of $\vec{x}$, we will have $m_i$ time
that we observed 1. A simple example of $m_i$ would be how many times we
had 4 after rolling a dice 20 times. Thus, the Multinomial distribution describes the joint probability of
observing quantities $m_i$'s after $N$ total experiments (e.g, dice
rolls) 

$$
\begin{align} 
{Mult}\left(m_1, m_2, \ldots, m_k \mid \vec{\mu}, N\right)  = \\ 
= \binom{N}{\left(m_1, m_2, \ldots, m_k\right)} \cdot \prod_{i=1}^k \mu_i^{m_i}= \\ 
= \frac{N!}{m_{1}!m_{2}!\ldots m_{k}!} \cdot \prod_{i=1}^k \mu_i^{m i}
\end{align}
$$

$~$

$~$
### Dirichlet
$~$

Dirichlet distribution is a conjugate prior for the Multinomial. It uses
$\vec{\alpha}$ to parameterise a function that is perfect for describing
the variables $\vec{\mu}$ where $0 \leq \mu_{i} \geq 1$ &
$\sum_i \mu_i = 1$. 

$$
\begin{align} 
{Dir}(\vec{\mu} \mid \vec{\alpha})=\frac{\Gamma\left(\alpha_0\right)}{\Gamma\left(\alpha_1\right) \ldots \Gamma\left(\alpha_k\right)} \prod_{i=1}^k \mu_i^{\alpha_i-1} \ . 
\end{align}
$$

The posterior for multinomial distribution then becomes

$$
\begin{align} 
p(\vec{\mu} \mid D, \alpha)=\operatorname{Dir}(\vec{\mu} \mid \vec{\alpha}+\vec{m})= \\ =\frac{\Gamma\left(\alpha_0+N\right)}{\Gamma\left(\alpha_1+m_1\right) \ldots \Gamma\left(\alpha_k+m_k\right)} \prod_{i=1}^k \mu_i^{\alpha_i+m_i-1}
\end{align}
$$

$~$

$~$
### Normal 
$~$

Yet another distribution that probably does not need a lot of intro is a
Gaussian single-variate 

$$
\begin{align} 
N\left(x \mid \mu, \sigma^2\right)=\frac{1}{\left(2 \pi \sigma^2\right)^{\frac{1}{2}}} e^{-\frac{1}{2 \sqrt{\sigma}}(x-\mu)^2}
\end{align}
$$ 

or a Gaussian multivariate 

$$
\begin{align} 
N(\vec{x} \mid \vec{\mu}, \Sigma)=\frac{1}{(2 \pi)^{0 / 2}} \frac{1}{\mid \Sigma^{1 / 2}} e^{-\frac{1}{2}(\vec{x}-\vec{\mu})^{\top} \Sigma^{-1}(\vec{x} - \vec{\mu})} \ . 
\end{align}
$$

The parameter $\vec{\mu} \in \mathbb{R}^D$ is the mean vector where $\vec{\mu}$
also show the expected values for each dimension of the variable vector
$\vec{x} \in \mathbb{R}^D$. The $\Sigma$ matrix is called the covariance
matrix and needs to be positive definite for the probability mass to
exist. The covariance matrix can also be diagonal. That helps with its
inversion ($\Sigma^{-1}$ is often called the
precision matrix) and makes all the variables $x_i$ independent of one
another. Gamma is a conjugate prior to the Gaussian.

$~$

$~$
## Linear Models 
$~$

Now, we can move on to building simple linear models.

$~$
### Simple Linear Regression
$~$

Linear regression solves the problem of modeling a continues
$t \in \mathbb{R}$ based on the observed data points $\vec{x}$'s. The
underpinning assumption that we are making when modeling $t$ is that it
is generated by some deterministic linear process $y$ and a random
(white-noise) variable $\varepsilon$. The random variable is normally
distributed, zero centered and has a constant standard deviation
$\sigma$, i.e., the exponent of a Gaussian can be simplified
$\frac{1}{2}(\vec{t}-\vec{\mu})^{\top} \Sigma^{-1}(\vec{t} - \vec{\mu}) = \frac{1}{2} \sum_{i=1}^N\left(t_i-\vec{\omega}^{\top} \phi\left(\vec{x}_i\right)\right)^2$.
We say $\varepsilon \sim N (0, \beta^{-1})$ where $\sigma^{-2} = \beta$.
Then, $\vec{t}$ follows 

$$
\begin{align}
\vec{t} \sim N\left(y(\vec{x}, \vec{w}), \beta^{-1}\right)
\end{align}
$$
[//]: # (\label{eq:linear_reg_y})

where $\vec{x}$ is a vector of features and $\vec{w}$
are the weights of the linear model. The model $y$ is in turn a linear
combination of weights and basis function values

$$
\begin{align}
y(\vec{x}, \vec{\omega}) = \omega_0 + \sum_{j=1}^{M+1} \omega_j \phi_j(\vec{x}) = \sum_{j=0}^{M} \omega_j \phi_j(\vec{x})
\end{align}
$$

and

$$
\left\{
\begin{array}{c}
\vec{x} \in \mathbb{R}^D \\
\vec{w} \in \mathbb{R}^M
\end{array}
\right.
$$
[//]: # (\label{eq:linear_reg_y_1})

where $\phi_j(\cdot)$ is some (non-)linear basis
function, e.g., [radial
basis](#https://hackernoon.com/radial-basis-functions-types-advantages-and-use-cases)
functions. Later, we will work with
$\Phi = [\vec{\phi}_{1}^{\top}(\vec{x_1}), \vec{\phi}_{2}^{\top}(\vec{x_2}) ... \vec{\phi}_{N}^{\top}(\vec{x_N})]$
and
$\vec{\phi}_{i} = [\phi_1(\vec{x}_i), \phi_2(\vec{x}_i), ..., \phi_M(\vec{x}_i)]$.
This is the features matrix that holds pre-calculated basis function
output values for each data point $\vec{x}$.

To make it more complete, the pdf of $t$ is thus 

$$
\begin{align} 
P(t \mid \vec{x}, \vec{\omega}, \beta)=N\left(t | y(\vec{x}, \vec{\omega}), \beta^{-1}\right) \ . 
\end{align}
$$
[//]: # (\label{eq:linear_reg_y_2})

If we collected a bunch of data points
$D = \{(\vec{x}_1,t_1), (\vec{x}_2,t_2) ... (\vec{x}_N,t_N)\}$ with the
target being $\vec{t} = [t_1, t_2, ... t_N]$ and features
$X = [\vec{x}_1, \vec{x}_2, ... \vec{x}_N]$, the likelihood model
becomes 

$$
\begin{align} 
P(D | \vec{W}) = p(\vec{t} | X, \vec{w}, \beta) = \prod_{i=1}^N N(t_i|\vec{w} \cdot \phi(\vec{x_i}, \beta^{-1})) \ . 
\end{align}
$$
[//]: # (\label{eq:linear_reg_y_3})

Taking the logarithm of the likelihood function, we arrive to the log
likelihood: 

$$
\begin{align} 
\ln p(t \mid X, \vec{w}, \beta) =\sum_{i=1}^N \ln N\left(t_i \mid \vec{\omega}^{\top} \phi\left(\vec{x}_i\right), \beta^{-1}\right) = \frac{N}{2} \ln \beta-\frac{N}{2} \ln (2 \pi)- \beta \cdot {E}_D(\vec{w})
\end{align}
$$ 
[//]: # (\label{eq:linear_reg_y_3})

where 

$$
\begin{align} 
E_{D}(\vec{w})=\frac{1}{2} \sum_{i=1}^N\left(t_i-\vec{\omega}^{\top} \phi\left(\vec{x}_i\right)\right)^2
\end{align}
$$
[//]: # (\label{eq:linear_reg_y_3})

is the sum-of-squares error.

In order to find the Maximum Likelihood Estimator for the mean we can
continue with 

$$
\begin{align} 
\vec{w}_{MLE} = \underset{w}{\operatorname{argmax}} \ p(D \mid \vec{\omega}) \Leftrightarrow \underset{w}{\operatorname{argmax}} \prod_{i=1}^{N} p\left(t_i \mid \vec{w}\right) \Leftrightarrow \underset{w}{\operatorname{argmax}} \sum_{i=1}^N \ln p\left(t_i \mid \vec{w}\right)
\end{align}
$$
[//]: # (\label{eq:linear_reg_mle})

The Maximum Aposteriori Estimation is then 

$$
\begin{align} 
p(\vec{w} \mid D) = p(\vec{w} \mid x, \vec{t}, \beta, \alpha) = \frac{p(\vec{t} \mid x, \vec{w}, \beta) p(\vec{w} \mid \alpha)}{ \underbrace{p(\vec{t} \mid x, \beta, \alpha)}_\text{independent of $\vec{w}$} }
\end{align}
$$
[//]: # (\label{eq:linear_reg_map_1})


$$
\begin{align} 
\vec{w}_{MAP} &= \underset{w}{\operatorname{argmax}} \prod_{i=1}^N p\left(t_i \mid \vec{x}_i, \vec{w}, \beta\right) P(\vec{w} \mid \alpha) \\
&= \underset{w}{\operatorname{argmax}} \sum_i^N\left[\ln \left(p\left(t_i \mid \vec{x}_i, \vec{w}, \beta\right)\right) + \ln p(\vec{w} | \alpha)]\right.
\end{align}
$$
[//]: # (\label{eq:linear_reg_map_2})

If we assume an uninformative prior, i.e., the weights are i.i.d. and
have a constant variance, the log probability takes form

$$
\begin{align} 
\ln (p(\vec{w} \mid \alpha))=\ln (N(0, \alpha)) = \ln \left(\frac{1}{2 \pi} \alpha\right)^{1 / 2} e^{{-\frac{1}{2} \alpha} \vec{w}^{\top} \vec{w}} \ .
\end{align}
$$
[//]: # (\label{eq:linear_reg_map_3})

Optimising MAP becomes is then equivalent to extremising
the partial derivative of the posterior w.r.t. the weights

$$
\begin{align} 
\frac{\partial p(\vec{w} \mid D)}{\partial \vec{w}} &=  \frac{\partial \ln p(\vec{w} | \Phi, \vec{t}, \alpha, \beta)}{\partial \vec{w}} =  \frac{\partial \ln p(\vec{t} \mid \vec{w}, \Phi, \beta)}{\partial \vec{w}}+\frac{\partial \ln p(\vec{w} | \alpha)}{\partial \vec{w}} = \\
&= \frac{\partial}{\partial \vec{w}}\left(\frac{1}{2 \sigma_{\beta}^2}(\vec{t}-\Phi \vec{w})^{\top}(\vec{t}-\Phi \vec{w}) \right) +\frac{\partial}{\partial \vec{w}}\left(\frac{1}{2\sigma_{\alpha}^2} \vec{w}^{\top} \vec{w} \right) \\ 
&=\frac{1}{\sigma_{\beta}^2}\left(\vec{w}^{\top} \Phi^{\top} \Phi-t^{\top} \Phi\right)+\frac{1}{\sigma_\alpha^2} w^{\top} = \beta\left(\vec{w}^{\top} \Phi^{\top} \Phi-t^{\top} \Phi\right) + {\alpha} \vec{w}^{\top} 
\end{align}
$$
[//]: # (\label{eq:linear_reg_map_5})


$$
\begin{align} 
\beta\left(\vec{\omega}^{\top} \phi^{\top} \phi-\vec{t}^{\top} \Phi\right)+\alpha \vec{w}^{\top}=0 \\
\vec{w}^{\top}\left(\beta \Phi^{\top} \Phi+\alpha I\right)-\beta \vec{t}^{\top} \Phi=0 \\
\vec{w}^{\top}\left(\beta \Phi^{\top} \Phi+\alpha I\right)=\beta \vec{t}^{\top} \Phi \\
\vec{w}^{\top} = \vec{t} \Phi\left(\Phi^{\top} \Phi+\frac{\alpha}{\beta} I\right)^{-1} \\
\vec{w}_{MAP}=\left(\Phi^{\top} \Phi + \lambda \mathbb{I} \right)^{-1} \Phi^{\top} \vec{t} \ . 
\end{align}
$$
[//]: # (\label{eq:linear_reg_map_4})

The Maximum likelihood estimator is found in the same manner

$$
\begin{align} 
\vec{w}_{MLE}=\left(\Phi^{\top} \Phi \right)^{-1} \Phi^{\top} \vec{t} \ .  
\end{align}
$$
[//]: # (\label{eq:linear_reg_mle_solution})

Comparing the above MAP estimator to the MLE one, you can see that
former is a scaled version of the later. That is because MAP here acts
as a regularisation technique (i.e., reducing variance in weights
$\vec{w}$). Therefore, uninformative prior is equivalent to applying
regularisation on the weight coefficients and the higher the $\lambda$
the more regularisation we are applying.

### Bayesian Linear Regression

Bayesian regression describes the full distribution of $\vec{w}$ and
does not assume the prior's weights to be the same for all observations.
Let's assume the mean $m_0$ and covariance matrix $S_0$ describe the
prior normal distribution of model weights, then the posterior

$$
\begin{align} 
p\left(\vec{w} \mid \vec{t}, \Phi, \beta, m_0, S_0\right) &= \frac{p\left(\vec{w} | m_0, s_0\right) \cdot p(\vec{t} \mid \Phi, \vec{w}, \beta)}{\underbrace{p(\vec{t} \mid \Phi, \alpha)}_{\int_{\vec{w}} p(\vec{t} | \Phi, \alpha, \beta) \cdot p(\vec{w}|\alpha)d\vec{w}} } 
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_posterior_1})

$$
\begin{align} 
p\left(\vec{w} \mid \vec{t}, \Phi, \beta, m_0, S_0\right) & \propto  p\left(\vec{w} | \vec{m}_0, s_0\right) \cdot p\left(\vec{t} | \Phi, \vec{w}_0, \beta \right) \ .
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_posterior_2})

Now, when we extremise the log posterior, both the prior and the
likelihood are Gaussian's 

$$
\begin{align} 
\ln (\text{posterior}) &= \ln (\text{normalising const. of the prior} \times \text{exponent of the prior}) + \\ 
& + \ln(\text{normalising const. of the likelihood} \times \text{exponent of the likelihood}) \ .
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_ln_posterior_form})

Then,

$$
\begin{align} 
\ln p(\vec{w} \mid D) &= -\frac{1}{2}\left(\sigma^{-2}(\Phi \vec{w} - \vec{t})^T (\Phi \vec{w}-\vec{t})\right) - \frac{1}{2}\left( (\vec{m}_0-\vec{w})^{\top} S_0^{-1} (\vec{m}_0-\vec{w})\right) = \\ 
& = \frac{1}{2}(\underbrace{\vec{w}^{\top}\left(\sigma^{-2} \Phi^{\top} \Phi+S_0^{-1}\right) \vec{w}}_{(1)}) + \underbrace{\left(\sigma^2 \Phi^{\top} t+S_0^{-1} \vec{m}_0\right)^{\top}}_{(2)} \vec{w}) - \\
& - \frac{1}{2}\underbrace{(\sigma^{-2} \vec{t}^{\top} \vec{t} - \vec{m}_0 S_0^{-1} \vec{m}_0)}_{(3)} \ .
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_ln_posterior_1})

We know by conjugacy that multiplying two Guassians (prior $\times$
likelihood) will give us a Gaussian with the new parameters $\vec{m}_N$
and $S_N$ 

$$
\begin{align} 
\ln p(\vec{w} \mid D) &= \ln N\left(\vec{w} | \vec{m}_N, S_N\right) = -\frac{1}{2}\left(\vec{w}-\vec{m}_N\right)^{\top} S_N^{-1}\left(\vec{w}-\vec{m}_N\right) = \\
&= -\frac{1}{2} \underbrace{\vec{w}^{\top} S_N^{-1} \vec{w}}_{(1)} + \underbrace{\vec{m}_N^{\top} S_N^{-1} \vec{w}}_{(2)} - \frac{1}{2} \underbrace{\vec{m}_N^{\top} S_N^{-1} \vec{m}_N}_{(3)} \ .
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_ln_posterior_2})

We see that the both sides of
[\[eq:bayes_linear_reg_posterior_2\]](#eq:bayes_linear_reg_posterior_2){reference-type="ref"
reference="eq:bayes_linear_reg_posterior_2"} match. The expressions (1)
& (2) can be equated to each other and solved separately. The expression
(3) can be ignored since it is independent of $\vec{w}$

$$
\begin{align} 
\vec{m}_N &= S_N \left(S_0^{-1} \vec{m}_0 + \sigma^2 \Phi^{\top} \vec{t} \right)  \\
S_N^{-1} &= \sigma^{-2} \Phi^{\top} \Phi + S_0^{-1}
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_solution})

If a uninformative zero-mean and isotropic (i.e., same variance in all
directions) prior is assumed, i.e.,
$p(\vec{w} \mid \alpha) = N\left(\vec{w} \mid 0, \alpha^{-1} I\right)$,
then the solution becomes 

$$
\begin{align} 
& \vec{m}_N=\beta S_N \Phi^{\top} \vec{t} \\ 
& S_N^{-1}=\alpha I+\beta \Phi^{\top} \Phi
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_uninformative_proir_solution})

When the solution is put back into the predictive function which is a
convolution (i.e., integral w.r.t $\vec{w}$) of two Gaussian's

$$
\begin{align} 
p(t \mid \vec{t}, \alpha, \beta)=\int_{\vec{w}} p(t \mid \vec{w}, \beta) p(\vec{w} \mid \vec{t}, \alpha, \beta) \mathrm{d} \vec{w} \\
p(t \mid \vec{x}, \vec{t}, \alpha, \beta)=\mathcal{N}\left(t \mid \vec{m}_N^{\top} \vec{\phi}(\vec{x}), \sigma_N^2(\vec{x})\right)
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_predictive_func})

If we go for the predictive point estimate (mean of the predictive
distribution) for $t$ based on a new observation $\vec{x}$ then

$$
\begin{align} 
y(\vec{x}, \vec{w}) &= \sum_j^{M} w_j \phi_j(\vec{x}) = \vec{w}^{\top} \vec{\phi}(\vec{x}) = \vec{m_N}^{\top} \vec{\phi}(\vec{x}) = \beta \vec{\phi}^{\top}(\vec{x}) {S}_N \Phi^{\top} \vec{t} = \\
& = \sum_{i=1}^N \underbrace{\beta \vec{\phi}(\vec{x}) S_N \vec{\phi}\left(\vec{x}_i\right)}_\text{weight} \underbrace{t_i}_\text{past observation}
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_predictive_func})

What we get back is the fact that we can rewrite the result of Bayesian
regression as the weighted sum of past observations

$$
\begin{align} 
y(\vec{x}, \vec{\omega})=\sum_{i=1}^N k\left(\vec{x}, \vec{x}_i\right) t_i
\end{align}
$$
[//]: # (\label{eq:bayes_linear_reg_predictive_func_is_with_kernel})

where the weight of each data point is determined by the kernel
$k\left(\vec{x}, \vec{x}_i\right) = \vec{\phi}(\vec{x}) S_N \vec{\phi}\left(\vec{x}_i\right)$.
Note that $\sum_{i=1}^N k\left(\vec{x}_i, x_i\right)=1$ which is not be
obvious from the first sight. It is however logical if you think about
it. If it was not true, one would get inconsistent results, i.e., higher
or much lower than (already observed) $t_i$. We can also notice that the
kernel function outputs are proportionate to the covariance matrix $S_N$
of the posterior/weights. It indicates that if a new data point
$\vec{x}$ is close to the past $\vec{x}_i$ in the basis function space,
i.e., dot product $\vec{\phi}(\vec{x})\vec{\phi}\left(\vec{x}_i\right)$
scaled by the strength coefficients of linear relationships between the
observed data points $S_N$, then the observation $t_i$ contributes more
to the new prediction $t$.

### Equivalent Kernel

Let's see if we can rewrite a MAP (Ridge Regression) estimator in terms
of kernels. The loss function (opposite of likelihood) becomes

$$
\begin{align} 
L(\vec{w}) &= \sum_{i=1}^N\left(t_i-y\left(\vec{x}_i, \vec{w}\right)\right)^2 +\lambda / 2 \vec{w}^{\top} \vec{w} \\
&= \|\Phi \vec{w}-\vec{t}\|_2^2+ \frac{\lambda}{2}\vec{w}^{\top} \vec{w} \ .
\end{align}
$$
[//]: # (\label{eq:ridge_reg_kernel_0})

Or equivalently, 

$$
\begin{align} 
\vec{w} &= (\Phi^{\top} \Phi - \lambda \mathbb{1})^{-1} \Phi^{\top} \vec{t} \ \ \ \ \ \ \ \ \ \text{(Primal Form)}  \\
\lambda \vec{w} &= \Phi^{\top} (\Phi \vec{w} + \vec{t}) \\
\vec{w} &= \Phi^{\top}\left(\frac{1}{\lambda}(\Phi \vec{w} + t)\right) \\
\vec{w} &= \Phi^{\top}a  \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \  \ \ \ \ \ \ \ \text{(Dual Form)} \ .
\end{align}
$$
[//]: # (\label{eq:ridge_reg_kernel_1})

We know that the dual form exists and we can rewrite the weights as
$\Phi^{\top}a$ 

$$
\begin{align} 
L(\vec{a}) &= (\Phi \Phi \vec{a}-\vec{t})^{\top}(\Phi \Phi \vec{a}-\vec{t}) + \frac{\lambda}{2} \vec{w} \vec{w} \\ 
&= \frac{1}{2}\left(\vec{a}^{\top} \Phi \Phi^{\top} \Phi \Phi^{\top} \vec{a}\right. - \left.\vec{t}^{\top} \Phi \Phi^{\top} \vec{a}-\Phi \Phi^{\top} \vec{a} \vec{t}-\vec{t}^{\top} \vec{t}\right) +\lambda / 2 \quad \vec{a}^{\top} \Phi \Phi^{\top} \vec{a} \\ 
\end{align}
$$
[//]: # (\label{eq:ridge_reg_kernel_2})

$$
\begin{align} 
\frac{\partial L(\vec{a})}{\partial \bar{a}} = \frac{1}{2}\left(2 \Phi \Phi^{\top} \Phi \Phi^{\top} \vec{a}\right. \left.-2 \Phi^{\top} \Phi \vec{t}\right)+\lambda \Phi \Phi^{\top} \vec{\Phi}\vec{a} &= 0 \\
\Phi \Phi^{\top} \vec{a}-\vec{t}+\lambda \vec{a} &= 0 \\
\left(\Phi \Phi^{\top}+\lambda I\right) \vec{a} &= \vec{t} \\
\vec{a} &= \left( \underbrace{\Phi \Phi^{\top}}_\text{$K$ or Gram matrix} - \lambda I\right)^{-1} \vec{t}
\end{align}
$$
[//]: # (\label{eq:ridge_reg_kernel_3})

For inference, 

$$
\begin{align} 
y(\vec{x})=\vec{w}^{\top} \phi(\vec{x}) = \vec{a}^{\top} \Phi \phi(\vec{x})=\Phi \phi(\vec{x})(K + \lambda \mathbb{1})^{-1} \vec{t} = \Phi \phi(\vec{x})(\Phi \Phi^{\top} + \lambda \mathbb{1})^{-1} \vec{t} 
\end{align}
$$
[//]: # (\label{eq:ridge_reg_kernel_4})

Why is this dual formulation useful? The Gram matrix $\Phi\Phi^{\top}$
is a lot of dot products N (instead of $M$ as for primal form solution
where it is $\Phi^{\top}\Phi$), plus we need to invert it too. Well,
when we want to represent our data in a very very high dimensional
space, we can choose $\phi(\cdot)$ for which the dot product
$\phi(\vec{x})^{\top}\phi(\vec{x})$ is well defined and easy to
calculate (look at Kernalisation section
[here](#https://ml-course.github.io/master/intro.html)). Then, instead
of doing all the products and explicitly defining
$\vec{\phi}(\vec{x}) \in \mathbb{R}^{100000}$, we just operate and do
all the calculations with just 10 numbers defined by
$\vec{x} \in \mathbb{R}^{10}$. This enables us to easily transition -
conveniently compute dot products - between raw observation space
$\vec{x}$ and the kernel space, that is implicitly very high
dimensional, to model more complex relationships with a lower memory
footprint. Thus, the ideal us of kernels is when for
$\vec{x} \in \mathbb{R}^k$ and $\vec{\phi}(\vec{x}) \in \mathbb{R}^m$,
$k<<m$ and the number of observations $N$ is small enough to fit in
memory. Use kernels when you do not want to explicitly calculate feature
design matrix $\Phi$ and do all the dot products.

### Kernel Regression

There could be a pure non-parametric regression defined with kernels.
Here, kernels will measure the distance (in the space defined by the
kernel) between the new observation $\vec{x}$ and all the past
observations giving higher weights to the ones that are closer. We will
not assume a functional form and rely on the new understanding of a
regression means: 

$$
\begin{align} 
y(\vec{x}) = E(t \mid \vec{x}) = \int {t} p (t \mid \vec{x})dt = \frac{\int t p(t,\vec{x})dt}{p(\vec{x})} \ . 
\end{align}
$$
[//]: # (\label{eq:kernel_reg_0})

The simplest case of kernel regression is when we take a point
$\vec{x}_0$ and make a prediction for it $t_0$ based on its neighbours
in the observed data. We consider a point $\vec{x}_i$ a neighbor if it
is within distance $h$ from $\vec{x}_0$ and we weigh each neighbour
equally. Then, 

$$
\begin{align} 
y\left(\vec{x}_0\right) &= \frac{\sum_{i=1}^N t_i I\left(\left\|\vec{x}_i-\vec{x}_0\right\| \leq h\right)}{\sum_{i=1}^N I\left(\left\|\vec{x}_i-\vec{x}_0\right\| \leq h\right)} \\ 
&= \sum_{i=1}^N \frac{\left.t I\left(\left|\vec{x}_i-\vec{x}_0\right| \leq h\right)\right)}{\sum_{i=1}^I\left(\left|\vec{x}_i-\vec{x}_0\right| \leq h\right)}\\
&= N_{i=1}^N \omega_i\left(\vec{x}_0\right) t_i \ .
\end{align}
$$
[//]: # (\label{eq:kernel_reg_1})

To make the the things more complex (and possibly more accurate),
instead of a counter function $I(\cdot)$, we can apply a continues
function that would measure the distance between a pair of observations
in some arbitrary space and produce a weights:

$$
\begin{align} 
y\left(\vec{x}_0\right)=\sum_{i=1}^N \frac{t_i K\left(x_{i s} \vec{x}_0\right)}{\sum_{i=1}^N K\left(\vec{x}_i, \vec{x}_0\right)}=\sum_{i=1}^N \omega_i\left(\vec{x}_0\right) t_i
\end{align}
$$
[//]: # (\label{eq:kernel_reg_2})

If we want to parameterise a kernel regression then we can use weighted
least squares approximator where $K(\vec{x}_i, \vec{x}_j) = w_{ij}$ and
the model weights are $\beta$ 

$$
\begin{align} 
\beta = (X^{\top}WX)^{-1}X^{\top}W\vec{t} \ . 
\end{align}
$$
[//]: # (\label{eq:kernel_reg_3})
