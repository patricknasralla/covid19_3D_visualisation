How to Use.
Left click and drag or drag finger to rotate the globe.

Scroll or pinch to zoom in and out.

Move the slider to move through time. Play/Pause button starts and stops playback.

What is this showing me?
The visualisation displays the (cumulative) number of confirmed Coronavirus cases over time by country/region. Data is taken from the Johns Hopkins combined global dataset which is available here: https://github.com/CSSEGISandData/COVID-19.

Each point is displaced away from the surface by an amount that takes in to account the number of cases of the 4 closest recorded countries/regions and applies an inverse square falloff. Displacement is the Log(10) of the total cases for that point. This means that if there are only a few cases in an area, the number of dots and their displacement will be much less than if there are hundreds or thousands.

The more cases there are, the more the virus will spread to neighbouring regions and so spread as well as displacement increase as cases do.

Why create this?
A great deal of in depth visualisations for these data currently exist. The dashboard created by Johns Hopkins is a good example. However, none of these attempt to convey the idea of how a disease spreads over time. When we talk about "flattening the curve" what we mean is attempting to slow the spread of disease, not stop it. But my hope is that this visualisation will help people understand how important that "slowing down" is. Just look at how quickly the spread has ramped up from the beginning of March. This aims by using real data to give viewers an idea of just how crazy an exponential increase is.

We can all help to curb this spread by adhering to the advice given by medical professionals and public health organisations. In the end, if this makes even one person think that it's better to distance and isolate then I'll think it was time well spent!

How was this made?
Built in React with Three.js and custom Vertex/Fragment GLSL shader code.

Animation runs entirely on GPU once initial calculations triangulate distances from data points (given in data by lat/long coordinates). The case data is sent to the shader via a texture (tutorial on that is imminent).

Source code available here. Feel free to fork and drop me a tweet if you think things can be improved (or if you'd just like to comment).