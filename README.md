skopiuj package.lock na maina, usuń actions.ts, usuń data z Chat route

## Prompt 1

### Context

You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI, Tailwind CSS and Framer Motion.

Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.

Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use maps instead.
- Use functional components with TypeScript interfaces.

Syntax and Formatting

- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.
- Use Blue and Purple from Tailwind CSS color palette as base colors.
- Use Framer Motion to make site more dynamic and interactive.
- Play with shadows and smooth animations on DOM elements.
- Try to create futuristic, standing-out designs

Performance Optimization

- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC).
- Wrap client components in Suspense with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, include size data, implement lazy loading.

Key Conventions

- Use 'nuqs' for URL search parameter state management.
- Optimize Web Vitals (LCP, CLS, FID).
- Limit 'use client':
- Favor server components and Next.js SSR.
- Use only for Web API access in small components.
- Avoid for data fetching or state management.

Follow Next.js docs for Data Fetching, Rendering, and Routing.

### Project idea

Let's create app router Next.js AI shopping assistant, aiming to help users find the best products on the internet based on their needs. Lets call it Shoppy.
I want to have two pages:

- landing page
- the assistant chat itself

Let's start with the landing page:

### Background

Background of the whole page should look like the notebook grid, with really thin lines. It also should have gradient from top to bottom using base colors. Remember about the dark/light theme - it should change too.

### Navigation

Landing page should have half-transparent navigation at the top, with the logo on on the left and navigation items on the right. Implement a mobile hamburger menu for smaller screens. Add light/dark theme. Navigation items will be:

- Benefits
- Pricing
- Contact
- Try for Free

"Benefits", "Pricing" and "Contact" click should scroll to the corresponding section on landing page and "Try for Free" should be a cool, standing out Next.js Link to assistant chat route.

### Banner

Make banner with slick, engaging slogan with base colors gradient, smaller text and base colors gradient button "Try for Free" (with some shadow) leading to the chat route. Smaller text should have typing effect applied in a loop.

### Benefits

Think of 5 benefits and show them in original, eye-catching cards. You can add fitting images with shadow. Give them gradient going to transparent to make background grid slightly visible. Add shadow.

### Pricing

Under benefits should be pricing in three boxes with the best one in the middle.

### Contact

Under pricing create the contact section.

---

## Prompt 2 (after some styling)

Ok, cool. Now lets go to the /chat route itself. Keep the context of what we have done till now to keep the styles, folders structure and elements behaviors context. Here is the base code we will be working on.

**_Paste vercel sdk docs base component_**

Let's create a chat with nicely styled messages and avatars. Use framer motion for messages. Add "Send" button with loading state while chat is answering and less eye-catching "New chat" button next to it.

---

## Prompt 3

I refactored chat page a little bit, so take that as a base code for the next changes:

**_Paste refactored component_**

After doing some research with the user, assistant will create perfect query and fetch the best suited items for him using function getResults() . When fetching starts, I want the items box with loading state to show in the chat area under the messages. Here's the fetched items object form:
{
title: string,
price: string,
image: string,
link: string,
}
Use framer motion. Loader should be centered in items box. Remember about responsiveness and theme colors.
