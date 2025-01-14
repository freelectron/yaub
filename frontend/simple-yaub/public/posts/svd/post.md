<center>
    <h1> Singular Value Decomposition  </h1>
</center>

$~$

$~$
## Why do we care? 🤔
$~$

This post gives you a whiff of a tool called Singular Value Decomposition (SVD) that is used
in problems related to compression and uncovering hidden structures within your data.
This thin slice of Linear Algebra is ubiquitous in modeling and 
the applications of this technique discussed here stretch into a number of domains.

$~$

$~$
## Matrix-Vector Multiplication 📐
$~$

We start by giving an overview of different visual interpretations of
matrix vector product. 

$~$

$~$
### Transformation
$~$

[//]: # (::: wrapfigure)
[//]: # (R0.5)
[//]: # (![image]&#40;pics/svd/matrix_is_vector_transofrmation.png&#41;{width="0.9\\linewidth"})
[//]: # (:::)
<p align="center" id="fig:test_train_error">
    <br>
    <strong> Figure 1: Matrix Vector Transformation </strong>
    <br>
  <img width="500" height="350" src="/posts/svd/images/matrix_is_vector_transofrmation.png">
    <br>
    <br>
</p>

For many people, the most common definition of matrix vector
multiplication (dot product) is a transformation of a vector from one
form to another. It is a function that takes in the components of a
vector, does product and sum operations on them, and spits out a new
vector. The resulting vector is then a rotated and/or stretched version
of the original.

For example, 90 degrees rotation matrix is $A = \begin{bmatrix}
   0 & -1 \\[3pt]
   1 &  0 \\
\end{bmatrix}$. If we wanted to position vector $\vec{v}$
90anticlockwise, we can multiply it with $-A$ (see
Figure 1). Additionally, scaling
the vector while rotating it in space could be done with just applying a
constant factor to the multiplication.

Similarly, instead of a single vector you can transform an (infinite)
collection of vectors. In that case you can represent the same points in
space with different values.

$~$

$~$
###  Change of Basis
$~$

A matrix in linear algebra can also be viewed as a set of basis vectors
that transforms a vector represented in one basis to another. Commonly,
2D vectors are represented with the standard basis
$B = (\vec{b}_1, \vec{b}_2)$ where
$\vec{b}_1 = \left[\begin{array}{l} 1 \\ 0 \end{array}\right]$,
$\vec{b}_2 = \left[\begin{array}{l} 0 \\ 1 \end{array}\right]$. There
are situations however where you'd want to have a different basis
$B^{'}= (\vec{b^{'}}_1, \vec{b^{'}}_2)$ to represent your vectors. For
example, let's imagine that
$\vec{b^{'}}_1 = 2 \cdot \vec{b}_1  + 1 \cdot \vec{b}_2 = \left[\begin{array}{l} 2 \\ 1 \end{array}\right]$,
$\vec{b^{'}}_2 = -1 \cdot \vec{b}_1  + 1 \cdot \vec{b}_2 = \left[\begin{array}{l} -1 \\ 1 \end{array}\right]$.
Then, you can check that a vector with coordinates
$\left[\begin{array}{l} - 4 \\ 1 \end{array}\right]$ in $B$ will have
the same position as vector
$\left[\begin{array}{l} - 1 \\ 2 \end{array}\right]$ in $B^{'}$. To get
to that result, it is sufficient to apply the change of basis matrix on
the vector that you want to know the coordinates of in the standard
basis

$$
\begin{align}
\underbrace{\left[\begin{array}{cc}2 & -1 \\ 1 & 1\end{array}\right]_{B^{'} \mapsto B}} _{A} \underbrace{\left[\begin{array}{l} -1 \\ 2 \end{array}\right]}_{\vec{v^{'}}} = \underbrace{\left[\begin{array}{c} -4 \\ 1\end{array}\right]_B}_{\vec{v}} .
\end{align}
$$

where $A = (\vec{a_1}, \vec{a_2}) = (\vec{b^{'}}_1, \vec{b^{'}}_2)$ and
$a_1 = 2 \cdot \vec{b_1} + 1 \cdot \vec{b_2} =  \left[\begin{array}{l} 2 \\ 1 \end{array}\right]$
and
$a_2 = -1 \cdot \vec{b_1} + 1 \cdot \vec{b_2} =  \left[\begin{array}{l} -1 \\ 1 \end{array}\right]$
are the \"transformation\" vectors that map $B^{'}$ to $B$. 
To verify, you can use the fact that the change of basis matrix is
represented in units of $B$ and calculate the coordinates of
$\vec{v^{'}}$:

$$
\begin{align}
\vec{v} &= -1 \vec{b^{'}}_1 + 2 \vec{b^{'}}_2 \\
                   &= -1 \left[\begin{array}{l} 2 \\ 1 \end{array}\right] + 2 \left[\begin{array}{l} -1 \\ 1 \end{array}\right]  = \left[\begin{array}{l} -4 \\ 1 \end{array}\right] .
\end{align}
$$

Therefore, by applying a matrix you transition to a new coordinate
system (e.g., if the change of basis matrix is described in standard units then we move into the standard basis). 
This is extremely useful if you are given a problem (e.g., 90 degrees rotation) and your basis is
described in units that are hard to work with (e.g., a shape is
described in weird transformed coordinates system). Then, one can change
basis, solve the problem (e.g., apply a known 90 degrees rotation matrix
on the shape) and change the basis back to get the final vector.

$~$

Assume, we are given $\vec{v}$ and we want to find a $\vec{v}`$ that is
a 90 degrees rotation of $\vec{v}$. We can first apply the change of
basis matrix that would produce a vector in our standard basis

$$
\begin{align}
C  \vec{v} \ .
\end{align}
$$

Now, we can work with our standard coordinates and apply the desired 90
degree rotation transformation matrix

$$
\begin{align}
A C  \vec{v} \ .
\end{align}
$$

Finally, we revert back to the initial coordinates system described by
applying the inverted change of basis matrix

$$
\begin{align}
 C^{-1}  A  C  \vec{v} \ .
\end{align}
$$

$~$

$~$
### Projection 
$~$

[//]: # (::: wrapfigure)
[//]: # (R0.5 ![image]&#40;pics/svd/projection.png&#41;{width="0.9\\linewidth"})
[//]: # (:::)
<p align="center" id="fig:projection-line">
    <br>
    <strong> Figure 2: Matrix-Vector Multiplication as Projection </strong>
    <br>
   <img width="400" height="300" src="/posts/svd/images/projection.png">
    <br>
    <br>
</p>

Last but not least, a matrix vector product can be connected to the dot
product operation and be seen as a projection onto a line defined in the
same space. In turn, we can say that the projection is multiplication of a unit
vector on the line scaled by some factor. Figure 2 depicts $c\cdot \vec{v}$;
the projection vector that appears on the line as a result of drawing a distance vector that connects 
$\vec{x}$ and the line orthogonally. Therefore,

$$
\begin{align}
\vec{v}\left( \vec{x} - c\vec{v}\right) = 0 \\
c = \frac{\vec{x} \vec{v}}{\vec{v} \vec{v}} \implies \\
\operatorname{Proj}_L(\vec{x})= c\cdot \vec{v} =\frac{\vec{x} \vec{v}}{\vec{v} \vec{v}}\vec{v}  \ .
\end{align}
$$

If $\vec{v}$ is a unit vector, i.e., $\vec{v}\vec{v} = ||\vec{v}|| = 1$,

$$
\begin{align}
\operatorname{Proj}_L(\vec{x})= \left( \vec{x} \vec{v} \right) \vec{v}  \ .
\end{align}
$$

Then we can rewrite the vector product as a matrix-vector product 

$$
\begin{align}
\left( \vec{x} \vec{v} \right) \vec{v}  \equiv A\vec{x} \ 
\end{align}
$$

where $A = \left[\vec{b_1} \  \vec{b_2}\right]$ and

$$
\begin{align}
\vec{b_1} =  \left(\left[\begin{array}{l} 1 \\ 0 \end{array}\right] \cdot \vec{v} \right) \vec{v} \\ 
\vec{b_2} =  \left(\left[\begin{array}{l} 0 \\ 1 \end{array}\right] \cdot \vec{v} \right) \vec{v}
\end{align}
$$

[//]: # (::: wrapfigure)
[//]: # (R0.5 ![image]&#40;pics/svd/projection_C_A.png&#41;{width="0.9\\linewidth"})
[//]: # (:::)
<p align="center" id="fig:projection-plane">
    <br>
    <strong> Figure 3: Matrix-Vector Multiplication as Projection </strong> 
    <br>
  <img width="400" height="300" src="/posts/svd/images/projection_C_A.png">
    <br>
    <br>
</p>

Oh gods, but what if we have $A\vec{x} = \vec{b}$ where
$A \in \mathit{R}^{n \times k}$, $A \in \mathit{R}^{k}$ and
$b \in \mathit{R}^{n}$. This means we have a so called
\"over-determined\" system where $k$ = rank of $A < n$. Hence, the
dimensionality of the vector $dim(\vec{x})$ and the dimensionality of
its projection $dim(\vec{b})$ are different. Since $\vec{b}$ is not in
the columns space of $A$ ($C(A)$), we will try to find $\vec{x}^{*}$
such that (Euclidean) distance between $\vec{b}$ and $A\vec{x}^{*}$ is
minimised. See Figure 3 for another visual.

Formally,

$$
\begin{align}
min \  ||\vec{b} - A\vec{x}^{*} ||
\end{align}
$$

or,

$$
\begin{align}
\left|\left|\begin{array}{l}b_1-v_1 \\ b_2-v_2 \\ ... \\ b_n-v_n\end{array}\right|\right|=\sqrt{\left(b_1-v_1\right)^2+\left(b_2+v_2\right)^2+\ldots+\left(b_n-v_A\right)^2}
\end{align}
$$

Well, the closest vector in $C(A)$ to $\vec{b}$ will be
$\operatorname{Proj}_{C(A)}(\vec{b})$

$$
\begin{align}
A \vec{x}^*=\operatorname{Proj_{C(A)}}(\vec{b}) \ .
\end{align}
$$

Then,

$$
\begin{align}
A \vec{x}^*-\vec{b} = \operatorname{Proj}_{C(A)}(\vec{b})-\vec{b} \ .
\end{align}
$$

And by definition of orthogonal projections

$$
\begin{align}
A \vec{x}^{*}- \vec{b} \perp C(A) \ .
% this is because Ax* and b create a 90 degree angle since Ax* is the projection of b
\end{align}
$$

Or, in other words, $A \vec{x}^{*}- \vec{b} \in C(A)^{\perp}$. We also
know that $C(A)^{\perp} = N(A^{T})$, i.e., orthogonal component of $A$
is in the null space of $A^{T}$. Hence,
$A \vec{x}^{*}- \vec{b} \in N(A^{T})$, or

$$
\begin{align}
\begin{array}{l}A^{\top}\left(A \vec{x}^*-\vec{b}\right)=\overrightarrow{0} \\ A A \vec{x}^*-A \vec{b}=\overrightarrow{0} \\ A^{\top} A \vec{x}^*=A^{T} \vec{b} \\ \vec{x}^*=\left(A^{\top} A\right)^{-1} A^{\top} \vec{b} \ .
\end{array}
\end{align}
$$

This is also what we call the least-square approximation of a regression problem.

$~$

$~$
## Eigenvectors 📏
$~$

As we saw, a matrix multiplication is a transformation operation. Well,
there are some vectors that keep staying on the the same line when the transformation is applied on
them. Those vectors are called eigenvectors. While they keep being on
the same line, they often get scaled this means they might change their
direction and/or magnitude. Mathematically, a single eigenvector could be represented as follows

$$
% \label{eq:eigen_vectors_values}
\begin{align}
\begin{array}{l}
A \vec{v}=\lambda \vec{v}  \\
A \vec{v}=\lambda \vec{v} \\ A \vec{v}=\lambda I \vec{v} \\
(A-\lambda I) \vec{v}=0 \\
\{ \text{by the property of the determinant} \} \\
\operatorname{det}(A-\lambda I)=0
\end{array}
\end{align}
$$

We can rewrite this equation for all eigenvectors of $A$ as

$$
\begin{align}
A \vec{v} & =\lambda \vec{v} \\
A {Q} & = {Q} {\Lambda} \\
A &= {Q} {\lambda} {Q}^{-1}
\end{align}
$$

to produce the eigendecomposition of matrix $A$. Interesting fact that the eigenvectors of symmetric matrices
are orthogonal to each other and span the entire vector space of $A$.

$~$

$~$
## Singular Value Decomposition 🦠🔄
$~$

This technique can be used to reconstruct a data sample with fewer
features and/or inspect patterns within it. All of this becomes possible
through finding a set of orthogonal vectors that encode our original
features into a (lower) dimensionality where linear relationships
between features are assumed. That makes our data look linearly
decorrelated while also capturing the maximum variation.

$~$

$~$
### Why decorrelate & capture variance? 
$~$

Remember all familiar formulas for variance and covariance

$$
\begin{align}
{Var}(X_{:,j})&=\frac{1}{N} \sum_i\left(X_{i j} - \bar{x}_j\right)^2 \\
{Cov}(X_{:,j}, X_{:,z}) &= \frac{1}{N} \sum_i\left(X_{i j} - \bar{x}_j\right)\left(X_{i z} - \bar{x}_z\right) \ .
\end{align}
$$

In a nutshell, variance tells us how much variation there is in the
distribution of values for a single feature. A higher variance means
that the data points are more spread out across the feature's domain and
there is diversity in the data that we might want to account
for/capture. Similarly, covariance describes the degree of one feature
varying linearly with respect to the other. A higher covariance signals
that the two features might be linearly dependent, and informs about
possible patterns within the data. Let us find the intuition behind the
reasons to decorrelate data. The assumption here is that if the data
shows that there are two linearly dependent features, we might want to create
a space where it is no longer the case, i.e., a single latent variable
would capture this linear relationship and encode the dependent features.

[//]: # (![Data points collected for three features. There seems to be a linear)
[//]: # (relationship between features $d_1$ and)
[//]: # ($d_3$.]&#40;pics/svd/svd_intro_change_of_basis_a.png&#41;{#fig:svd_intro_change_of_basis_a)
[//]: # (width="90%" height="0.32\\textheight"})
[//]: # ()
[//]: # (![We can encode each data point with two features instead of three. The)
[//]: # (original features could be easily reconstructed since parameters $a$ and)
[//]: # ($b$ are)
[//]: # ([//]: # &#40;learnt.]&#40;pics/svd/svd_intro_change_of_basis_b.png&#41;{#fig:svd_intro_change_of_basis_b&#41;width="90%"})
<p align="center" id="fig:svd_intro_change_of_basis">
    <br>
    <strong> Figure 4: Encoding features </strong>
    <div style="display: flex; justify-content: center;">
        <img src="/posts/svd/images/svd_intro_change_of_basis_a.png" alt="Image 1" style="width: 30%; margin-right: 10px;">
        <img src="/posts/svd/images/svd_intro_change_of_basis_b.png" alt="Image 2" style="width: 30%; margin-left: 10px;">
        <br>
        <br>
    </div>
    <br>
</p>


Imagine that we have collected a data sample with three features. Within that sample,
a pair of features $d_1$ and $d_3$ have a perfect (negative)
linear relationship with each other and, therefore, "strong\"
covariance. Further, imagine that there is a non-zero "weak\" covariance
between $d_2$ and $d_3$. Besides, this weak covariance $d_2$ and $d_3$
could be merely a result of random noise effecting the data collection
process. Figure 4-Left tries miserably to display such scenario.

Let's focus on $d_1$ and $d_3$ because their variation
can be captured perfectly. Using a modeling technique, we can parameterise the relationship between
$d_1$ and $d_3$ and reconstruct them in a single latent variable $d_0$.
Graphically, it means that $d_1$ and $d_3$ are squashed into a single
line and the feature space is transformed, see Figure 4-Right. 
Since the old correlated features no longer exist, the covariance between the new features on the
2D plane is zero. Our data becomes decorrelated. Finally, the two
features are encoded into one so we no longer need to store three values
per data point. We can only store two values while remembering the
coefficients of the linear model. We have achieved lossless data
compression as we can perfectly reconstruct the original data with fewer
values!

$~$

In the real world, perfect linear relationships between features are
extremely rare. We can however still capture linear relationship within
data and decorrelate it. The only difference is that we are not able to
(perfectly) encode the data with fewer values. This is because each
linear relationship modeled will have a random error component of
different magnitude. In general, the stronger the linear relationship
the more variation in the data is captured by it, and the less the error
is. That is why when encoding features, if we keep latent variables with
the strongest linear dependence (and low reconstruction error), 
we can be able to compress the data and only lose minimal amount of information. 
As already mentioned, a simple estimate of  the strength of a linear relationship is (co)-variance.
Hence, maximising the (co)-variance we are trying to ensure that we are
efficiently encoding more of our data.

$~$

Most often, all $M$ features that would be in the data set have
non-zero covariances. The idea behind Singular Value Decomposition (SVD)
is that instead of creating just one latent variable, we create $M$ of
them. Those variables will capture linear relationships
and de-correlate the data which will enable us to inspect the patterns occurring in a new space.
In the next section, we see what we can actually do to
create this latent space. There are multiple ways to look at the
procedure of de-correlating data, e.g., linear problem for
reconstructing original points, projection operation that maximises
variance, but we take an approach where it is presented as a change of
basis operation previously discussed.

$~$

$~$
### Changing basis with the Covariance Matrix 
$~$

One can think of a set of data points as representing a matrix of some
sort ($X$). The data points are scattered around the feature space and
one can find the average vector over all the points ($\vec{m}$). Thus,
in order to arrive to any data point vector $\vec{x_i}$ we would need to add
up the average vector and the difference vector
$\vec{s_i} = \vec{x_i} - \vec{m}$. The difference vector then can be
expressed with a new basis represented by a change of basis matrix $A$.
The new basis assumes that the data points are represented with some
(latent) vector $\vec{z_i}$ where the vector addition
$\vec{x_i} = \vec{s_i} + \vec{m} = A\vec{z_i} + \vec{m}$ holds. 
Within the new basis, all the data points are decorrelated,
$Cov(X) = \mathit{1}$, i.e., $z_i$'s constitute a white
noise data. However, once multiplied by the change of basis matrix $A$ 
they actually show the behaviour that our original data had,
i.e., they show how the white noise got spread out in our multidimensional space.
Thus, the columns of $A$ will be some sort of combination of basis vectors and tell us in
which directions the data gets stretched.

[//]: # (![Each data point's vector $\vec{x_i}$ can be represented as the sun of)
[//]: # (the average vector $\vec{m}$ and the difference vector)
[//]: # ($\vec{s_i}$.]&#40;pics/svd/svd_change_of_basis_a.png&#41;{#fig:first)
[//]: # (width="\\textwidth"})
[//]: # ()
[//]: # (![The difference vector can be represented in a new basis $\vec{z_i}$)
[//]: # (which is a scaled and translated version of)
[//]: # ($\vec{s_i}$.]&#40;pics/svd/svd_change_of_basis_b.png&#41;{#fig:third)
[//]: # (width="\\textwidth"})
<p align="center" id="fig:svd_intro_change_of_basis">
    <br>
    <strong> Figure 5: Change of basis </strong>
    <div style="display: flex; justify-content: center;">
        <img src="/posts/svd/images/svd_change_of_basis_a.png" alt="Image 1" style="width: 30%; margin-right: 10px;">
        <img src="/posts/svd/images/svd_change_of_basis_b.png" alt="Image 2" style="width: 30%; margin-left: 10px;">
        <br>
        <br>
    </div>
    <br>
</p>

*Now, I will closely follow Peter Bloem's tutorials/book. I read quite a
few resources that try to explain PCA/SVD in an intuitive manner. None
of them connected with me as much as the explanations that Peter gave.*

$~$

Let's generalise the results from a single vector $\vec{x_i}$ to the
whole dataset. Our data point vectors become columns in $X^T$ while
$\vec{z_i}$'s become columns in $Z^T$

$$
\begin{align}
% X^T - \left[\begin{array}{l} \vec{m} \\ \vdots \\\vec{m} \end{array}\right]  &= AZ^T \\
X^T - \vec{m}  &= AZ^T &\text{(simplified the notation)} 
% \label{eq:svd_normalised_data}
\end{align}
$$

Remember that we assumed that our $z_i$'s are distributed with
$Cov(Z)=\mathit{1}$. Then, look at the covariance of the left-hand side
$X - \vec{m}$ and find an interesting relationship. Note that the
${Cov}(X - \vec{m}) = {Cov}(X)$ since $\vec{m}$ is just like subtracting
a constant,

$$
\begin{align}
{Cov}(X)=\frac{1}{n} A {Z}^{\top}\left(A {Z}^{\top}\right)^{\top}=\frac{1}{n} A {Z}^{\top} {Z} {A}^{\top}=A {Cov}({Z}) A^{\top}=A \mathit{1} A^{\top}=AA^{\top} = S \ .
% \label{eq:svd_cov_x}
\end{align}
$$

The result is mind-blowing, right? We have the covariance matrix popping
up in the transformation of white noise! What?! Who would have expected
that?! Moreover, we once again see that the covariance matrix is
symmetric, and by the spectral theorem - [the
proof](#https://peterbloem.nl/blog/pca-3) of which is not the easiest to
do, and takes quite a bit of time to go through - we know that it can be
decomposed with orthogonal basis consisting of eigenvectors of $S$ (and
real eigenvalues).

$$
\begin{align}
 S = AA^{\top} = PDP^{\top} \ .
\end{align}
$$

Where $P$ is an orthogonal matrix ($P^{-1} = P^{T}$), i.e., square
matrices in which all columns are mutually orthogonal unit vectors. This
is so neat because we can easily find $A$

$$
\begin{align}
A A^{\top} &= PDP^{\top} = {P D}^{\frac{1}{2}} {D}^{\frac{1}{2}^{\top}} {P}^{\top} \\
& \text { then } {A}=P{D}^{\frac{1}{2}} \text{ and } {A}^{-1}={D}^{-\frac{1}{2}}P^{\top}
\end{align}
$$

As you can see the behaviour of your data can be described by the
eigenvalues and eigenvectors of your covariance matrix. Thus,
transforming one's data from white noise to something that actually has
variance and correlations/patterns along all the dimension, one needs to
scale white noise data by ${D}^{\frac{1}{2}}$, transform by $P$ and add
$\vec{m}$, i.e.,
$A\vec{z_i} + \vec{m} = P{D}^{\frac{1}{2}}\vec{z_i} + \vec{m} \ \forall i$.

Alternatively, you can also say that if you take the standard basis,
divide it by the square root of your covariance matrix's eigenvalues and
transform by the eigenvectors, you will arrive to the basis that makes
your data's covariance be a diagonal matrix, i.e., your data becomes
white noise. Intuitively, this also means that your standard basis,
where all your dimensions are a unit vector, gets reshaped. Then, some
dimensions are more squeezed than others to accommodate for the
data variance and make the data along those dimensions white noise!
Thus, $P$ and ${D}^{\frac{1}{2}}$ give you all the info about your
data's variance and how to describe it with just linear transformations.

$~$

$~$
### Finding Maximum Variance Directions 
$~$

We just saw how to transform (stretch and squeeze) our space to make the
data be decorrelated and back. Encoding our features into a set of
latent variables is therefore possible. However, as already briefly
mentioned in the Section about the reasons to decorrelate your data, we need to make sure
that the linear relationships being created as a result of changing the basis are actually "strong\"
and not just random deviations in the data. Thus, we are trying to
figure out how to capture (co)-variance efficiently so that if we were
to reduce the number of dimensions in the data we would not be getting rid of too much
information.

$~$

Here, the concepts of maximum (co)-variance and eigenvectors/values of
the covariance matrix need to be connected together. Previously, we said
that we want to encode the "strongest\" relationships between features
and that the (co)-variance can serve as a gauge for this strength.
Therefore, if we can find the directions of maximum variance, we can
project the data on them, i.e., model the "stronger\" linear
relationships between different features.

$~$

We can look at the problem of finding the maximum variance from a different
point of view. How can we extrapolate our data further away from the
origin - we assume that the data is already normalised - based on the
existing linear relationships within the sample? The covariance matrix
already describes our data/features in terms of their (co)-variance, so we
can thus check the "(co)-variance score" of each direction by (i.e., the quadratic form).

$$
\begin{align}
\nu(\vec{w}) = \vec{w}^{\top} S \vec{w}
\end{align}
$$

This score is a polynomial of the second degree and linear in its
parameters ($S$) that means that if $\nu(\vec{w_i}) > \nu(\vec{w_j})$
then $\nu(c  \vec{w_i}) > \nu(c  \vec{w_j})$ where $c$ is some constant.
Informally, if we were to generate data points as multiples of some
$\vec{w_{max}}$ they would spread our data from the origin the most,
i.e., maximum variability. The direction of maximum variance in the data
is nothing more than a combination of feature values (a data point
vector $\vec{w_{max}}$) where dimensions with higher data variances and
covariances are given higher values relative to the rest of features
with lower (co)-variances. If take a 2D example

$$
\begin{align}
\vec{w}^{\top} S \vec{w} = \vec{w}^{\top}\left(\begin{array}{ll}
0.5 & 2 \\
2 & 1.1
\end{array}\right) \vec{w} =  0.5 w_1{ }^2 + 2 w_2 w_1+ 2 w_1 w_2 + 1.1 w_2{ }^2 \ .
\end{align}
$$
$\vec{w_{max}}$ would be the proportion $w_1 / w_2$ 
that gives the highest result to $\vec{w}^{\top} S \vec{w}$
given that $||\vec{w}||=c$ where $c$ could be in arbitrary scalar.

$~$

In other words, if we only had one unit of value to redistribute across
all the features how much would we weigh each one so that the resulting
combination would produce the highest overall (co)-variance score?
The problem becomes 

$$
\begin{align}
{\underset{w}{\operatorname{argmax}}} \ & \vec{w}^{\top} S \vec{w} \\
\text{s.t. } & \vec{w}^{\top}\vec{w} = 1   \ .
% \label{eq:svd_max_varaince_quadratic_form}
\end{align}
$$

If we are to assign one unit of value
$||\vec{w}||=1$ between $w_1$ and $w_2$, one might be tempted to just
have $w_1=0$ and $w_2=1$ (because the variance for the second dimension is the highest).
but we would lose out on the variance from the interactions then. 
That is why the maximum variance is reached if the
unit variance distributed in this proportion $w_1/w_2= 0.375/0.625$, or
in other words $\vec{w} = [0.375, 0.625]$.

$~$

The grand finale.. Rewrite the max variance 
equation with the knowledge about
the covariance matrix (of spectral theorem) that we acquired in the
previous section 
$$
\begin{align}
{\underset{w}{\operatorname{argmax}}} \ & \vec{w}^{\top} PDP^{\top} \vec{w} \\
\text{s.t. } & \vec{w}^{\top}\vec{w} = 1   \ .
% \label{eq:svd_max_varaince_eigen_quadratic_form}
\end{align}
$$

Now, if nothing is blowing your mind still, let me highlight two things
here: $P$ is orthogonal and the column vectors $\vec{P_{:,i}}$, i.e.,
eigenvectors of $S$, are orthonormal vectors while the matrix $D$ is
diagonal and all values but the diagonal ones being zero. Thus, the sum
$\vec{w}^{\top}PDP^{\top}\vec{w}$ is maximised when (a) the inner
product between $\vec{w}$ and $\vec{P_{:,i}}$ is maximised and (b) then
multiplied by the maximum value from the diagonal of $D$. However, the
inner product is maximised when $\vec{w}$ and an eigenvector
$\vec{P_{:,i}}$ are pointing in the same direction! The inner product
will actually be equal to 1 since $\vec{P_{:,i}}$ and $\vec{w}$ are both unit vectors.
Hence, the first maximum variance direction $\vec{w}_{max}$ can be
defined by $\vec{P_{:,i}}$ where $D_{i,i}>D_{j,j} \forall j$, i.e., the
eigenvector of $S$ with the highest eigenvalue. What about the second
maximum direction which is also orthogonal to the first one? Using the
same logic/intuition and the fact that there can only be $M$ ($Rank(S)$)
orthogonal vectors in total, the second maximum direction can then be
the eigenvector with the second largest eigenvalue.

$~$

$~$
### Singular Vectors & Values
$~$

In the last two sections, we got a high level understanding of two ideas.
First one, how we can de-correlate our data and transfer it to a different
latent space, i.e., different vector basis. Second, how eigenvectors of
the data covariance matrix are the directions of maximum variance, i.e.,
$\vec{P}_{:,i} = \vec{w}_{max}$.

$~$

We can now finally intro the term *right singular vector* of $X$. That is a
vector $\vec{v}$ which is an eigenvector of the covariance matrix
$S = X^{\top}X$. Right singular vectors of a matrix show the directions
of (maximum) variance in the data, see
Section *Finding Maximum Variance Directions*. Those directions also
correspond to the stretch direction that indicate where our data is
spread more from its white noise form if converted back to the
(original) standard basis, see
Section *Change of Basis*. Therefore, right singular vectors
serve our original purpose of encoding linear relationships within the
data and capturing maximum (co)-variance while doing so.

$~$

Moreover, we find exactly how much variance is captured with each
singular vector. In order to do this, one needs to see what value each of
our data points will take if we encode them in the new latent space with
the vector $\vec{v}$. The equivalent operation for this is
$\vec{y} = X \vec{v}$ or projecting (encoding) our data onto $\vec{v}$,
i.e., this is exactly what we implicitly did to get $d_0$ in
Section *Why decorrelate & capture variance?*. Since throughout last
parts of this article we assumed that our data $X$ is mean-centered, the
variance is just a multiplication of each of the (latent) variable
values with itself 

$$
\begin{align}
||\vec{y}||^2 =  \|X \vec{v}\|^2=\vec{v}^{\top} X^{\top} X \vec{v} = \vec{v}^{\top} D_{i,i} \vec{v} = D_{i,i} \vec{v}^{\top} \vec{v}= D_{i,i} \\ 
% \label{eq:svd_singular_values_are_eigenvalues_of_S}
\end{align}
$$ 
where $D_{i,i}$ is the eigenvalue of
$\vec{P}_{:,i} = \vec{w}_{max} = \vec{v}$. This value also the value
indicating how much variance we are capturing with the latent variable
defined by $\vec{v}$.

$~$

As already mentioned, $\vec{y}$ can be seen as a result of transferring
our data into a latent space defined by $\vec{v}$. If we are to do this
for all singular vectors $\vec{v}$, we create a new space that would
decorrelate our data. This is very similar to what we did in
the section about Change of Basis, when we were changing our bases.
In the new space, we would have our data decorrelated and some latent
variables would have higher variance than others. We can then also
define the direction of variance $\vec{u}$ for a latent variable that
comes as a result of projecting $X$ on a vector $\vec{v}$. In other
words, $X \vec{v} = y = \sigma \vec{u}$ where $\sigma$ is indicating the
degree of variance for that latent variable, or how much unit vector
$\vec{u}$ gets stretched. It is easy to find out this amount of stretch

$$
\begin{align}
\sigma = \frac{||\vec{y}||}{||\vec{u}||} = \frac{\sqrt{(y_{1}^2 + y_{2}^2 + ... + y_{N}^2)}}{1} = \sqrt{Var(\vec{y})} = \sqrt{D_{i,i}}
% \label{eq:svd_singular_values_are_eigenvalues_of_S}
\end{align}
$$ 

We call $\sigma$ a *singular value* of $X$. Finally,
$\vec{u}$ is called the *right singular vector* of $X$.

$~$

$~$
### Decomposition
$~$

Let's iterate again why we are doing what we are doing: finding the directions
of maximum variance and going through a fair share of linear algebra
(really quickly) to do it. Meanwhile, our goal is to represent our 
data points with new set of latent variables that encode linear
relationships between features and decorrelate them. In the past
sections, we saw that we are killing two birds with one stone if we are
looking for a set of orthogonal vectors that are also maximum variance directions.
We already saw that projecting our data onto a direction of maximum
variance ($\vec{w}_{max} = \vec{v}$) gives the values of the latent
variable produced by this projection. 

$$
\begin{align}
X \vec{v} =  \vec{u} \sigma  \ . \\
% \label{eq:svd_svd_equation_vectors}
\end{align}
$$

What if we were to project our data on to the space created by all
$\vec{v}$'s, i.e., stack $\vec{v}$ into a matrix $V$? We would then get
the representation of our data in the new latent space (for all latent
variables). The unit vector $\vec{u}$'s and their $\sigma$'s would also
need to be stacked up on the right side to create the equivalent
matrix - matrix multiplication $U\Sigma$, i.e., matrix $U$ for
$\vec{v}$'s and $\Sigma$ for $\sigma$'s. Previously, we mentioned that
$X$ is $NxM$ matrix and, since in the most of the real world cases it is
very overdetermined ($N>>M$) and its covariance matrix $S=X^{\top}X$ is
positive semi-definite with exactly $M$ non-zero eigenvalues/vectors, we
can say that $Rank(X)=M$, and we will have exactly $M$ $\vec{v}$ vectors.
This makes matrix $V$ to be $MxM$. We can then say that matrix $U$ must
be $NxN$. In order for the multiplication to work and stacked-up
$\vec{u}$'s be scaled properly, we need $\Sigma$ to be diagonal matrix
of $NxM$. One can easily check that if we are filling gaps with zero's,
we are not changing the assumptions that we have imposed earlier (e.g.,
decorrelated data in latent space and maximum variance captured). Hence,

$$
\begin{align}
X V =  U \Sigma  \ . \\
% \label{eq:svd_svd_equation_vectors}
\end{align}
$$

Given that $V$ is a square and orthogonal matrix, thus
$V^{-1} = V^{\top}$. The decomposition of $X$ then becomes
$$
\begin{align}
X =  U \Sigma  V^{\top} \ . \\
% \label{eq:svd_svd_equation_vectors}
\end{align}
$$

$~$

$~$
## References 📜
$~$

- [This blogpost would not be possible without Peter Bloem's clarifications](https://peterbloem.nl/blog/)   
- [Mathy explanation of change of basis](https://dbalague.pages.ewi.tudelft.nl/openlabook/Chapter4/ChangeOfBasis.html)

-   [Explanation of matrix as transformation](https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:matrices/x9e81a4f98389efdf:matrices-as-transformations/a/matrices-as-transformations)

-   [Explanation for matrix vector product as a projection](http://mitran-lab.amath.unc.edu/courses/MATH547/lessons/Lesson12.pdf)

-   [Great read about intuition behind PCA](https://stats.stackexchange.com/questions/2691/making-sense-of-principal-component-analysis-eigenvectors-eigenvalues)
