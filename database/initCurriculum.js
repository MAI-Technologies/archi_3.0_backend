const { Curriculum } = require("./schema/curriculum.js");

async function populateAlgebraI() {
    await Curriculum.create({
        topic: "Algebra I",
        section: [{
            name: "Number and Quantity",
            subsection: [{
                name: "The Real Number System",
                desc: "Use properties and operations to understand rational and irrational numbers. Understand categorization of sum or product of numbers.",
                additional_info: ["The sum and product of two rational numbers is rational.",
                    "The sum of a rational number and an irrational number is irrational.",
                    "The product of a nonzero rational number and an irrational number is irrational.",
                    "The sum and product of two irrational numbers could be either rational or irrational."]
            },
            {
                name: "Quantities",
                desc: "Reason quantitatively and use units to solve problems.",
                additional_info: []
            }]
        },
        {
            name: "Algebra",
            subsection: [{
                name: "Seeing Structure in Expressions",
                desc: "Interpret expressions in context, write standard form of a polynomial, rewrite expressions, and use exponent properties.",
                additional_info: []
            },
            {
                name: "Arithmetic with Polynomials and Rational Expressions",
                desc: "Perform arithmetic on polynomials, and understand relationship between zeros and polynomial factors.",
                additional_info: ["Add, subtract, and multiply polynomials and recognize that the result of the operation is also a polynomial. This forms a system analogous to the integers."]
            },
            {
                name: "Creating Equations",
                desc: "Create equations that describe numbers or relationships.",
                additional_info: ["Create equations and inequalities in one variable to represent a real-world context.",
                    "Create equations and linear inequalities in two variables to represent a real-world context.",
                    "Represent constraints by equations or inequalities, and by systems of equations and/or inequalities, and interpret solutions as viable or non-viable options in a modeling context.",
                    "Rewrite formulas to highlight a quantity of interest, using the same reasoning as in solving equations."]
            },
            {
                name: "Reasoning with Algebra and Inequalities",
                desc: "Understand and explain equation-solving processes, solve various types of equations and inequalities, and represent them graphically.",
                additional_info: []
            }]
        },
        {
            name: "Functions",
            subsection: [{
                name: "Interpreting Functions",
                desc: "Understand function concepts, use function notation, interpret functions in context, and analyze functions using different representations.",
                additional_info: []
            },
            {
                name: "Building Functions",
                desc: "",
                additional_info: ["Determine an explicit expression, a recursive process, or steps for calculation from a context.",
                    "Combine standard function types using arithmetic operations.",
                    "Compose functions and evaluate their output.",
                    "Invert functions and identify the relationship between a function and its inverse.",
                ]
            },
            {
                name: "Linear, Quadratic, and Exponential Models",
                desc: "Construct and compare linear, quadratic, and exponential models to solve problems.",
                additional_info: ["Fit a function to the data; use functions fitted to data to solve problems in the context of the data.",
                    "Interpret the parameters in a linear, quadratic, or exponential function in terms of a context.",
                    "Choose a function based on behavior or on rates of change to model a relationship between two quantities."]
            }]
        },
        {
            name: "Statistics and Probability",
            subsection: [{
                name: "Interpreting Categorical and Quantitative Data",
                desc: "Summarize, represent, and interpret data on a single count or measurement variable.",
                additional_info: ["Represent data with plots on the real number line (dot plots, histograms, and box plots).",
                    "Calculate measures of center (mean, median) and measures of spread (range, interquartile range, standard deviation).",
                    "Interpret differences in shape, center, and spread in the context of the data sets, accounting for possible effects of extreme data points (outliers)."]
            },
            {
                name: "Making Inferences and Justifying Conclusions",
                desc: "Understand and evaluate random processes underlying statistical experiments.",
                additional_info: ["Understand statistics as a process for making inferences about population parameters based on a random sample from that population.",
                    "Decide if a specified model is consistent with results from a given data-generating process.",
                    "Recognize the purposes of and differences among sample surveys, experiments, and observational studies."]
            }]
        }]
    });
}

module.exports = async () => {
    // Fetch all entries with topic "Algebra I"
    const algebraIEntries = await Curriculum.find({ topic: "Algebra I" });

    // Log the entries to the console
    //  console.log(JSON.stringify(algebraIEntries, null, 2));
    if (algebraIEntries.length > 0) return;

    try {
        await populateAlgebraI();
    } catch (err) {
        console.error(`Error: Cannot populate algebra I courses`);
        console.error(err);
    }


}