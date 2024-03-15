import { useCallback, useEffect, useRef, useState } from "react"
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";


type Formula = {
    Name: string,
    Description: string,
    Syntax: string
}

export const FORMULAS: Formula[] = [
    {
        "Name": "ARRAYFORMULA",
        "Description": "Enables the array arithmetic mode for a single formula.",
        "Syntax": "ARRAYFORMULA(Formula)"
    },
    {
        "Name": "FILTER",
        "Description": "Filters an array, based on multiple conditions (boolean arrays).",
        "Syntax": "FILTER(SourceArray, BoolArray1[, BoolArray2[, ...]])"
    },
    {
        "Name": "ARRAY_CONSTRAIN",
        "Description": "Truncates an array to given dimensions.",
        "Syntax": "ARRAY_CONSTRAIN(Array, Height, Width)"
    },
    {
        "Name": "DATE",
        "Description": "Returns the specified date as the number of full days since nullDate.",
        "Syntax": "DATE(Year, Month, Day)"
    },
    {
        "Name": "DATEDIF",
        "Description": "Calculates distance between two dates, in provided unit parameter.",
        "Syntax": "DATEDIF(Date1, Date2, Units)"
    },
    {
        "Name": "DATEVALUE",
        "Description": "Parses a date string and returns it as the number of full days since nullDate.\n\nAccepts formats set by the dateFormats option.",
        "Syntax": "DATEVALUE(Datestring)"
    },
    {
        "Name": "DAY",
        "Description": "Returns the day of the given date value.",
        "Syntax": "DAY(Number)"
    },
    {
        "Name": "DAYS",
        "Description": "Calculates the difference between two date values.",
        "Syntax": "DAYS(Date2, Date1)"
    },
    {
        "Name": "DAYS360",
        "Description": "Calculates the difference between two date values in days, in 360-day basis.",
        "Syntax": "DAYS360(Date2, Date1[, Format])"
    },
    {
        "Name": "EDATE",
        "Description": "Shifts the given startdate by given number of months and returns it as the number of full days since nullDate.[1]",
        "Syntax": "EDATE(Startdate, Months)"
    },
    {
        "Name": "EOMONTH",
        "Description": "Returns the date of the last day of a month which falls months away from the start date. Returns the value in the form of number of full days since nullDate.[1:1]",
        "Syntax": "EOMONTH(Startdate, Months)"
    },
    {
        "Name": "HOUR",
        "Description": "Returns hour component of given time.",
        "Syntax": "HOUR(Time)"
    },
    {
        "Name": "INTERVAL",
        "Description": "Returns interval string from given number of seconds.",
        "Syntax": "INTERVAL(Seconds)"
    },
    {
        "Name": "ISOWEEKNUM",
        "Description": "Returns an ISO week number that corresponds to the week of year.",
        "Syntax": "ISOWEEKNUM(Date)"
    },
    {
        "Name": "MINUTE",
        "Description": "Returns minute component of given time.",
        "Syntax": "MINUTE(Time)"
    },
    {
        "Name": "MONTH",
        "Description": "Returns the month for the given date value.",
        "Syntax": "MONTH(Number)"
    },
    {
        "Name": "NETWORKDAYS",
        "Description": "Returns the number of working days between two given dates.",
        "Syntax": "NETWORKDAYS(Date1, Date2[, Holidays])"
    },
    {
        "Name": "NETWORKDAYS.INTL",
        "Description": "Returns the number of working days between two given dates.",
        "Syntax": "NETWORKDAYS.INTL(Date1, Date2[, Mode [, Holidays]])"
    },
    {
        "Name": "NOW",
        "Description": "Returns current date + time as a number of days since nullDate.",
        "Syntax": "NOW()"
    },
    {
        "Name": "SECOND",
        "Description": "Returns second component of given time.",
        "Syntax": "SECOND(Time)"
    },
    {
        "Name": "TIME",
        "Description": "Returns the number that represents a given time as a fraction of full day.",
        "Syntax": "TIME(Hour, Minute, Second)"
    },
    {
        "Name": "TIMEVALUE",
        "Description": "Parses a time string and returns a number that represents it as a fraction of a full day.\n\nAccepts formats set by the timeFormats option.",
        "Syntax": "TIMEVALUE(Timestring)"
    },
    {
        "Name": "TODAY",
        "Description": "Returns an integer representing the current date as the number of full days since nullDate.",
        "Syntax": "TODAY()"
    },
    {
        "Name": "WEEKDAY",
        "Description": "Computes a number between 1-7 representing the day of week.",
        "Syntax": "WEEKDAY(Date, Type)"
    },
    {
        "Name": "WEEKNUM",
        "Description": "Returns a week number that corresponds to the week of year.",
        "Syntax": "WEEKNUM(Date, Type)"
    },
    {
        "Name": "WORKDAY",
        "Description": "Returns the working day number of days from start day.",
        "Syntax": "WORKDAY(Date, Shift[, Holidays])"
    },
    {
        "Name": "WORKDAY.INTL",
        "Description": "Returns the working day number of days from start day.",
        "Syntax": "WORKDAY(Date, Shift[, Mode[, Holidays]])"
    },
    {
        "Name": "YEAR",
        "Description": "Returns the year as a number according to the internal calculation rules.",
        "Syntax": "YEAR(Number)"
    },
    {
        "Name": "YEARFRAC",
        "Description": "Computes the difference between two date values, in fraction of years.",
        "Syntax": "YEARFRAC(Date2, Date1[, Format])"
    },
    {
        "Name": "BIN2DEC",
        "Description": "The result is the decimal number for the binary number entered.",
        "Syntax": "BIN2DEC(Number)"
    },
    {
        "Name": "BIN2HEX",
        "Description": "The result is the hexadecimal number for the binary number entered.",
        "Syntax": "BIN2HEX(Number, Places)"
    },
    {
        "Name": "BIN2OCT",
        "Description": "The result is the octal number for the binary number entered.",
        "Syntax": "BIN2OCT(Number, Places)"
    },
    {
        "Name": "BITAND",
        "Description": "Returns a bitwise logical \"and\" of the parameters.",
        "Syntax": "BITAND(Number1, Number2)"
    },
    {
        "Name": "BITLSHIFT",
        "Description": "Shifts a number left by n bits.",
        "Syntax": "BITLSHIFT(Number, Shift)"
    },
    {
        "Name": "BITOR",
        "Description": "Returns a bitwise logical \"or\" of the parameters.",
        "Syntax": "BITOR(Number1, Number2)"
    },
    {
        "Name": "BITRSHIFT",
        "Description": "Shifts a number right by n bits.",
        "Syntax": "BITRSHIFT(Number, Shift)"
    },
    {
        "Name": "BITXOR",
        "Description": "Returns a bitwise logical \"exclusive or\" of the parameters.",
        "Syntax": "BITXOR(Number1, Number2)"
    },
    {
        "Name": "COMPLEX",
        "Description": "Returns complex number from Re and Im parts.",
        "Syntax": "COMPLEX(Re, Im[, Symbol])"
    },
    {
        "Name": "DEC2BIN",
        "Description": "Returns the binary number for the decimal number entered between –512 and 511.",
        "Syntax": "DEC2BIN(Number, Places)"
    },
    {
        "Name": "DEC2HEX",
        "Description": "Returns the hexadecimal number for the decimal number entered.",
        "Syntax": "DEC2HEX(Number, Places)"
    },
    {
        "Name": "DEC2OCT",
        "Description": "Returns the octal number for the decimal number entered.",
        "Syntax": "DEC2OCT(Number, Places)"
    },
    {
        "Name": "DELTA",
        "Description": "Returns TRUE (1) if both numbers are equal, otherwise returns FALSE (0).",
        "Syntax": "DELTA(Number_1, Number_2)"
    },
    {
        "Name": "ERF",
        "Description": "Returns values of the Gaussian error integral.",
        "Syntax": "ERF(Lower_Limit, Upper_Limit)"
    },
    {
        "Name": "ERFC",
        "Description": "Returns complementary values of the Gaussian error integral between x and infinity.",
        "Syntax": "ERFC(Lower_Limit)"
    },
    {
        "Name": "HEX2BIN",
        "Description": "The result is the binary number for the hexadecimal number entered.",
        "Syntax": "HEX2BIN(Number, Places)"
    },
    {
        "Name": "HEX2DEC",
        "Description": "The result is the decimal number for the hexadecimal number entered.",
        "Syntax": "HEX2DEC(Number)"
    },
    {
        "Name": "HEX2OCT",
        "Description": "The result is the octal number for the hexadecimal number entered.",
        "Syntax": "HEX2OCT(Number, Places)"
    },
    {
        "Name": "IMABS",
        "Description": "Returns module of a complex number.",
        "Syntax": "IMABS(Complex)"
    },
    {
        "Name": "IMAGINARY",
        "Description": "Returns imaginary part of a complex number.",
        "Syntax": "IMAGINARY(Complex)"
    },
    {
        "Name": "IMARGUMENT",
        "Description": "Returns argument of a complex number.",
        "Syntax": "IMARGUMENT(Complex)"
    },
    {
        "Name": "IMCONJUGATE",
        "Description": "Returns conjugate of a complex number.",
        "Syntax": "IMCONJUGATE(Complex)"
    },
    {
        "Name": "IMCOS",
        "Description": "Returns cosine of a complex number.",
        "Syntax": "IMCOS(Complex)"
    },
    {
        "Name": "IMCOSH",
        "Description": "Returns hyperbolic cosine of a complex number.",
        "Syntax": "IMCOSH(Complex)"
    },
    {
        "Name": "IMCOT",
        "Description": "Returns cotangens of a complex number.",
        "Syntax": "IMCOT(Complex)"
    },
    {
        "Name": "IMCSC",
        "Description": "Returns cosecans of a complex number.",
        "Syntax": "IMCSC(Complex)"
    },
    {
        "Name": "IMCSCH",
        "Description": "Returns hyperbolic cosecans of a complex number.",
        "Syntax": "IMCSCH(Complex)"
    },
    {
        "Name": "IMDIV",
        "Description": "Divides two complex numbers.",
        "Syntax": "IMDIV(Complex1, Complex2)"
    },
    {
        "Name": "IMEXP",
        "Description": "Returns exponent of a complex number.",
        "Syntax": "IMEXP(Complex)"
    },
    {
        "Name": "IMLN",
        "Description": "Returns natural logarithm of a complex number.",
        "Syntax": "IMLN(Complex)"
    },
    {
        "Name": "IMLOG2",
        "Description": "Returns binary logarithm of a complex number.",
        "Syntax": "IMLOG2(Complex)"
    },
    {
        "Name": "IMLOG10",
        "Description": "Returns base-10 logarithm of a complex number.",
        "Syntax": "IMLOG10(Complex)"
    },
    {
        "Name": "IMPOWER",
        "Description": "Returns a complex number raised to a given power.",
        "Syntax": "IMPOWER(Complex, Number)"
    },
    {
        "Name": "IMPRODUCT",
        "Description": "Multiplies complex numbers.",
        "Syntax": "IMPRODUCT(Complex1 ...Complex30)"
    },
    {
        "Name": "IMREAL",
        "Description": "Returns real part of a complex number.",
        "Syntax": "IMREAL(Complex)"
    },
    {
        "Name": "IMSEC",
        "Description": "Returns the secant of a complex number.",
        "Syntax": "IMSEC(Complex)"
    },
    {
        "Name": "IMSECH",
        "Description": "Returns the hyperbolic secant of a complex number.",
        "Syntax": "IMSECH(Complex)"
    },
    {
        "Name": "IMSIN",
        "Description": "Returns sine of a complex number.",
        "Syntax": "IMSIN(Complex)"
    },
    {
        "Name": "IMSINH",
        "Description": "Returns hyperbolic sine of a complex number.",
        "Syntax": "IMSINH(Complex)"
    },
    {
        "Name": "IMSQRT",
        "Description": "Returns a square root of a complex number.",
        "Syntax": "IMSQRT(Complex)"
    },
    {
        "Name": "IMSUB",
        "Description": "Subtracts two complex numbers.",
        "Syntax": "IMSUB(Complex1, Complex2)"
    },
    {
        "Name": "IMSUM",
        "Description": "Adds complex numbers.",
        "Syntax": "IMSUM(Complex1 ...Complex30)"
    },
    {
        "Name": "IMTAN",
        "Description": "Returns the tangent of a complex number.",
        "Syntax": "IMTAN(Complex)"
    },
    {
        "Name": "OCT2BIN",
        "Description": "The result is the binary number for the octal number entered.",
        "Syntax": "OCT2BIN(Number, Places)"
    },
    {
        "Name": "OCT2DEC",
        "Description": "The result is the decimal number for the octal number entered.",
        "Syntax": "OCT2DEC(Number)"
    },
    {
        "Name": "OCT2HEX",
        "Description": "The result is the hexadecimal number for the octal number entered.",
        "Syntax": "OCT2HEX(Number, Places)"
    },
    {
        "Name": "ISBINARY",
        "Description": "Returns TRUE if provided value is a valid binary number.",
        "Syntax": "ISBINARY(Value)"
    },
    {
        "Name": "ISBLANK",
        "Description": "Returns TRUE if the reference to a cell is blank.",
        "Syntax": "ISBLANK(Value)"
    },
    {
        "Name": "ISERR",
        "Description": "Returns TRUE if the value is error value except #N/A!.",
        "Syntax": "ISERR(Value)"
    },
    {
        "Name": "ISERROR",
        "Description": "Returns TRUE if the value is general error value.",
        "Syntax": "ISERROR(Value)"
    },
    {
        "Name": "ISEVEN",
        "Description": "Returns TRUE if the value is an even integer, or FALSE if the value is odd.",
        "Syntax": "ISEVEN(Value)"
    },
    {
        "Name": "ISFORMULA",
        "Description": "Checks whether referenced cell is a formula.",
        "Syntax": "ISFORMULA(Value)"
    },
    {
        "Name": "ISLOGICAL",
        "Description": "Tests for a logical value (TRUE or FALSE).",
        "Syntax": "ISLOGICAL(Value)"
    },
    {
        "Name": "ISNA",
        "Description": "Returns TRUE if the value is #N/A! error.",
        "Syntax": "ISNA(Value)"
    },
    {
        "Name": "ISNONTEXT",
        "Description": "Tests if the cell contents are text or numbers, and returns FALSE if the contents are text.",
        "Syntax": "ISNONTEXT(Value)"
    },
    {
        "Name": "ISNUMBER",
        "Description": "Returns TRUE if the value refers to a number.",
        "Syntax": "ISNUMBER(Value)"
    },
    {
        "Name": "ISODD",
        "Description": "Returns TRUE if the value is odd, or FALSE if the number is even.",
        "Syntax": "ISODD(Value)"
    },
    {
        "Name": "ISREF",
        "Description": "Returns TRUE if provided value is #REF! error.",
        "Syntax": "ISREF(Value)"
    },
    {
        "Name": "ISTEXT",
        "Description": "Returns TRUE if the cell contents reference text.",
        "Syntax": "ISTEXT(Value)"
    },
    {
        "Name": "SHEET",
        "Description": "Returns sheet number of a given value or a formula sheet number if no argument is provided.",
        "Syntax": "SHEET([Value])"
    },
    {
        "Name": "SHEETS",
        "Description": "Returns number of sheet of a given reference or number of all sheets in workbook when no argument is provided.",
        "Syntax": "SHEETS([Value])"
    },
    {
        "Name": "NA",
        "Description": "Returns #N/A! error value.",
        "Syntax": "NA(Value)"
    },
    {
        "Name": "CUMIPMT",
        "Description": "Returns the cumulative interest paid on a loan between a start period and an end period.",
        "Syntax": "CUMIPMT(Rate, Nper, Pv, Start, End, type)"
    },
    {
        "Name": "CUMPRINC",
        "Description": "Returns the cumulative principal paid on a loan between a start period and an end period.",
        "Syntax": "CUMPRINC(Rate, Nper, Pv, Start, End, Type)"
    },
    {
        "Name": "DB",
        "Description": "Returns the depreciation of an asset for a period using the fixed-declining balance method.",
        "Syntax": "DB(Cost, Salvage, Life, Period[, Month])"
    },
    {
        "Name": "DDB",
        "Description": "Returns the depreciation of an asset for a period using the double-declining balance method.",
        "Syntax": "DDB(Cost, Salvage, Life, Period[, Factor])"
    },
    {
        "Name": "DOLLARDE",
        "Description": "Converts a price entered with a special notation to a price displayed as a decimal number.",
        "Syntax": "DOLLARDE(Price, Fraction)"
    },
    {
        "Name": "DOLLARFR",
        "Description": "Converts a price displayed as a decimal number to a price entered with a special notation.",
        "Syntax": "DOLLARFR(Price, Fraction)"
    },
    {
        "Name": "EFFECT",
        "Description": "Calculates the effective annual interest rate from a nominal interest rate and the number of compounding periods per year.",
        "Syntax": "EFFECT (Nominal_rate, Npery)"
    },
    {
        "Name": "FV",
        "Description": "Returns the future value of an investment.",
        "Syntax": "FV(Rate, Nper, Pmt[, Pv,[ Type]])"
    },
    {
        "Name": "FVSCHEDULE",
        "Description": "Returns the future value of an investment based on a rate schedule.",
        "Syntax": "FV(Pv, Schedule)"
    },
    {
        "Name": "IPMT",
        "Description": "Returns the interest portion of a given loan payment in a given payment period.",
        "Syntax": "IPMT(Rate, Per, Nper, Pv[, Fv[, Type]])"
    },
    {
        "Name": "ISPMT",
        "Description": "Returns the interest paid for a given period of an investment with equal principal payments.",
        "Syntax": "ISPMT(Rate, Per, Nper, Value)"
    },
    {
        "Name": "MIRR",
        "Description": "Returns modified internal value for cashflows.",
        "Syntax": "MIRR(Flows, FRate, RRate)"
    },
    {
        "Name": "NOMINAL",
        "Description": "Returns the nominal interest rate.",
        "Syntax": "NOMINAL(Effect_rate, Npery)"
    },
    {
        "Name": "NPER",
        "Description": "Returns the number of periods for an investment assuming periodic, constant payments and a constant interest rate.",
        "Syntax": "NPER(Rate, Pmt, Pv[, Fv[, Type]])"
    },
    {
        "Name": "NPV",
        "Description": "Returns net present value.",
        "Syntax": "NPV(Rate, Value1, ..., Value30)"
    },
    {
        "Name": "PDURATION",
        "Description": "Returns number of periods to reach specific value.",
        "Syntax": "PDURATION(Rate, Pv, Fv)"
    },
    {
        "Name": "PMT",
        "Description": "Returns the periodic payment for a loan.",
        "Syntax": "PMT(Rate, Nper, Pv[, Fv[, Type]])"
    },
    {
        "Name": "PPMT",
        "Description": "Calculates the principal portion of a given loan payment.",
        "Syntax": "PPMT(Rate, Per, Nper, Pv[, Fv[, Type]])"
    },
    {
        "Name": "PV",
        "Description": "Returns the present value of an investment.",
        "Syntax": "PV(Rate, Nper, Pmt[, Fv[, Type]])"
    },
    {
        "Name": "RATE",
        "Description": "Returns the interest rate per period of an annuity.",
        "Syntax": "RATE(Nper, Pmt, Pv[, Fv[, Type[, guess]]])"
    },
    {
        "Name": "RRI",
        "Description": "Returns an equivalent interest rate for the growth of an investment.",
        "Syntax": "RRI(Nper, Pv, Fv)"
    },
    {
        "Name": "SLN",
        "Description": "Returns the depreciation of an asset for one period, based on a straight-line method.",
        "Syntax": "SLN(Cost, Salvage, Life)"
    },
    {
        "Name": "SYD",
        "Description": "Returns the \"sum-of-years\" depreciation for an asset in a period.",
        "Syntax": "SYD(Cost, Salvage, Life, Period)"
    },
    {
        "Name": "TBILLEQ",
        "Description": "Returns the bond-equivalent yield for a Treasury bill.",
        "Syntax": "TBILLEQ(Settlement, Maturity, Discount)"
    },
    {
        "Name": "TBILLPRICE",
        "Description": "Returns the price per $100 face value for a Treasury bill.",
        "Syntax": "TBILLPRICE(Settlement, Maturity, Discount)"
    },
    {
        "Name": "TBILLYIELD",
        "Description": "Returns the yield for a Treasury bill.",
        "Syntax": "TBILLYIELD(Settlement, Maturity, Price)"
    },
    {
        "Name": "XNPV",
        "Description": "Returns net present value.",
        "Syntax": "XNPV(Rate, Payments, Dates)"
    },
    {
        "Name": "AND",
        "Description": "Returns TRUE if all arguments are TRUE.",
        "Syntax": "AND(Logicalvalue1, Logicalvalue2 ...Logicalvalue30)"
    },
    {
        "Name": "FALSE",
        "Description": "Returns the logical value FALSE.",
        "Syntax": "FALSE()"
    },
    {
        "Name": "IF",
        "Description": "Specifies a logical test to be performed.",
        "Syntax": "IF(Test, Then value, Otherwisevalue)"
    },
    {
        "Name": "IFS",
        "Description": "Evaluates multiple logical tests and returns a value that corresponds to the first true condition.",
        "Syntax": "IFS(Condition1, Value1[, Condition2, Value2[..., Condition_n, Value_n]])"
    },
    {
        "Name": "IFNA",
        "Description": "Returns the value if the cell does not contains the #N/A (value not available) error value, or the alternative value if it does.",
        "Syntax": "IFNA(Value, Alternate_value)"
    },
    {
        "Name": "IFERROR",
        "Description": "Returns the value if the cell does not contains an error value, or the alternative value if it does.",
        "Syntax": "IFERROR(Value, Alternate_value)"
    },
    {
        "Name": "NOT",
        "Description": "Complements (inverts) a logical value.",
        "Syntax": "NOT(Logicalvalue)"
    },
    {
        "Name": "SWITCH",
        "Description": "Evaluates a list of arguments, consisting of an expression followed by a value.",
        "Syntax": "SWITCH(Expression1, Value1[, Expression2, Value2[..., Expression_n, Value_n]])"
    },
    {
        "Name": "OR",
        "Description": "Returns TRUE if at least one argument is TRUE.",
        "Syntax": "OR(Logicalvalue1, Logicalvalue2 ...Logicalvalue30)"
    },
    {
        "Name": "TRUE",
        "Description": "The logical value is set to TRUE.",
        "Syntax": "TRUE()"
    },
    {
        "Name": "XOR",
        "Description": "Returns true if an odd number of arguments evaluates to TRUE.",
        "Syntax": "XOR(Logicalvalue1, Logicalvalue2 ...Logicalvalue30)"
    },
    {
        "Name": "ADDRESS",
        "Description": "Returns a cell reference as a string.",
        "Syntax": "ADDRESS(Row, Column[, AbsoluteRelativeMode[, UseA1Notation[, Sheet]]])"
    },
    {
        "Name": "CHOOSE",
        "Description": "Uses an index to return a value from a list of up to 30 values.",
        "Syntax": "CHOOSE(Index, Value1, ..., Value30)"
    },
    {
        "Name": "COLUMN",
        "Description": "Returns column number of a given reference or formula reference if argument not provided.",
        "Syntax": "COLUMNS([Reference])"
    },
    {
        "Name": "COLUMNS",
        "Description": "Returns the number of columns in the given reference.",
        "Syntax": "COLUMNS(Array)"
    },
    {
        "Name": "FORMULATEXT",
        "Description": "Returns a formula in a given cell as a string.",
        "Syntax": "FORMULATEXT(Reference)"
    },
    {
        "Name": "HLOOKUP",
        "Description": "Searches horizontally with reference to adjacent cells to the bottom.",
        "Syntax": "HLOOKUP(Search_Criterion, Array, Index, Sort_Order)"
    },
    {
        "Name": "HYPERLINK",
        "Description": "Stores the url in the cell's metadata. It can be read using method getCellHyperlink",
        "Syntax": "HYPERLINK(Url[, LinkLabel])"
    },
    {
        "Name": "INDEX",
        "Description": "Returns the contents of a cell specified by row and column number. The column number is optional and defaults to 1.",
        "Syntax": "INDEX(Range, Row [, Column])"
    },
    {
        "Name": "MATCH",
        "Description": "Returns the relative position of an item in an array that matches a specified value.",
        "Syntax": "MATCH(Searchcriterion, Lookuparray [, MatchType])"
    },
    {
        "Name": "OFFSET",
        "Description": "Returns the value of a cell offset by a certain number of rows and columns from a given reference point.",
        "Syntax": "OFFSET(Reference, Rows, Columns, Height, Width)"
    },
    {
        "Name": "ROW",
        "Description": "Returns row number of a given reference or formula reference if argument not provided.",
        "Syntax": "ROW([Reference])"
    },
    {
        "Name": "ROWS",
        "Description": "Returns the number of rows in the given reference.",
        "Syntax": "ROWS(Array)"
    },
    {
        "Name": "VLOOKUP",
        "Description": "Searches vertically with reference to adjacent cells to the right.",
        "Syntax": "VLOOKUP(Search_Criterion, Array, Index, Sort_Order)"
    },
    {
        "Name": "ABS",
        "Description": "Returns the absolute value of a number.",
        "Syntax": "ABS(Number)"
    },
    {
        "Name": "ACOS",
        "Description": "Returns the inverse trigonometric cosine of a number.",
        "Syntax": "ACOS(Number)"
    },
    {
        "Name": "ACOSH",
        "Description": "Returns the inverse hyperbolic cosine of a number.",
        "Syntax": "ACOSH(Number)"
    },
    {
        "Name": "ACOT",
        "Description": "Returns the inverse trigonometric cotangent of a number.",
        "Syntax": "ACOT(Number)"
    },
    {
        "Name": "ACOTH",
        "Description": "Returns the inverse hyperbolic cotangent of a number.",
        "Syntax": "ACOTH(Number)"
    },
    {
        "Name": "ARABIC",
        "Description": "Converts number from roman form.",
        "Syntax": "ARABIC(String)"
    },
    {
        "Name": "ASIN",
        "Description": "Returns the inverse trigonometric sine of a number.",
        "Syntax": "ASIN(Number)"
    },
    {
        "Name": "ASINH",
        "Description": "Returns the inverse hyperbolic sine of a number.",
        "Syntax": "ASINH(Number)"
    },
    {
        "Name": "ATAN",
        "Description": "Returns the inverse trigonometric tangent of a number.",
        "Syntax": "ATAN(Number)"
    },
    {
        "Name": "ATAN2",
        "Description": "Returns the inverse trigonometric tangent of the specified x and y coordinates.",
        "Syntax": "ATAN2(Numberx, Numbery)"
    },
    {
        "Name": "ATANH",
        "Description": "Returns the inverse hyperbolic tangent of a number.",
        "Syntax": "ATANH(Number)"
    },
    {
        "Name": "BASE",
        "Description": "Converts a positive integer to a specified base into a text from the numbering system.",
        "Syntax": "BASE(Number, Radix, [Minimumlength])"
    },
    {
        "Name": "CEILING",
        "Description": "Rounds a number up to the nearest multiple of Significance.",
        "Syntax": "CEILING(Number, Significance)"
    },
    {
        "Name": "CEILING.MATH",
        "Description": "Rounds a number up to the nearest multiple of Significance.",
        "Syntax": "CEILING.MATH(Number[, Significance[, Mode]])"
    },
    {
        "Name": "CEILING.PRECISE",
        "Description": "Rounds a number up to the nearest multiple of Significance.",
        "Syntax": "CEILING.PRECISE(Number[, Significance])"
    },
    {
        "Name": "COMBIN",
        "Description": "Returns number of combinations (without repetitions).",
        "Syntax": "COMBIN(Number, Number)"
    },
    {
        "Name": "COMBINA",
        "Description": "Returns number of combinations (with repetitions).",
        "Syntax": "COMBINA(Number, Number)"
    },
    {
        "Name": "COS",
        "Description": "Returns the cosine of the given angle (in radians).",
        "Syntax": "COS(Number)"
    },
    {
        "Name": "COSH",
        "Description": "Returns the hyperbolic cosine of the given value.",
        "Syntax": "COSH(Number)"
    },
    {
        "Name": "COT",
        "Description": "Returns the cotangent of the given angle (in radians).",
        "Syntax": "COT(Number)"
    },
    {
        "Name": "COTH",
        "Description": "Returns the hyperbolic cotangent of the given value.",
        "Syntax": "COTH(Number)"
    },
    {
        "Name": "COUNTUNIQUE",
        "Description": "Counts the number of unique values in a list of specified values and ranges.",
        "Syntax": "COUNTUNIQUE(Value1, [Value2, ...])"
    },
    {
        "Name": "CSC",
        "Description": "Returns the cosecans of the given angle (in radians).",
        "Syntax": "CSC(Number)"
    },
    {
        "Name": "CSCH",
        "Description": "Returns the hyperbolic cosecant of the given value.",
        "Syntax": "CSCH(Number)"
    },
    {
        "Name": "DECIMAL",
        "Description": "Converts text with characters from a number system to a positive integer in the base radix given.",
        "Syntax": "DECIMAL(\"Text\", Radix)"
    },
    {
        "Name": "DEGREES",
        "Description": "Converts radians into degrees.",
        "Syntax": "DEGREES(Number)"
    },
    {
        "Name": "EVEN",
        "Description": "Rounds a positive number up to the next even integer and a negative number down to the next even integer.",
        "Syntax": "EVEN(Number)"
    },
    {
        "Name": "EXP",
        "Description": "Returns constant e raised to the power of a number.",
        "Syntax": "EXP(Number)"
    },
    {
        "Name": "FACT",
        "Description": "Returns a factorial of a number.",
        "Syntax": "FACT(Number)"
    },
    {
        "Name": "FACTDOUBLE",
        "Description": "Returns a double factorial of a number.",
        "Syntax": "FACTDOUBLE(Number)"
    },
    {
        "Name": "FLOOR",
        "Description": "Rounds a number down to the nearest multiple of Significance.",
        "Syntax": "FLOOR(Number, Significance)"
    },
    {
        "Name": "FLOOR.MATH",
        "Description": "Rounds a number down to the nearest multiple of Significance.",
        "Syntax": "FLOOR.MATH(Number[, Significance[, Mode]])"
    },
    {
        "Name": "FLOOR.PRECISE",
        "Description": "Rounds a number down to the nearest multiple of Significance.",
        "Syntax": "FLOOR.PRECISE(Number[, Significance])"
    },
    {
        "Name": "GCD",
        "Description": "Computes greatest common divisor of numbers.",
        "Syntax": "GCD(Number1, Number2, ...)"
    },
    {
        "Name": "INT",
        "Description": "Rounds a number down to the nearest integer.",
        "Syntax": "INT(Number)"
    },
    {
        "Name": "ISO.CEILING",
        "Description": "Rounds a number up to the nearest multiple of Significance.",
        "Syntax": "ISO.CEILING(Number[, Significance])"
    },
    {
        "Name": "LCM",
        "Description": "Computes least common multiplicity of numbers.",
        "Syntax": "LCM(Number1, Number2, ...)"
    },
    {
        "Name": "LN",
        "Description": "Returns the natural logarithm based on the constant e of a number.",
        "Syntax": "LN(Number)"
    },
    {
        "Name": "LOG",
        "Description": "Returns the logarithm of a number to the specified base.",
        "Syntax": "LOG(Number, Base)"
    },
    {
        "Name": "LOG10",
        "Description": "Returns the base-10 logarithm of a number.",
        "Syntax": "LOG10(Number)"
    },
    {
        "Name": "MOD",
        "Description": "Returns the remainder when one integer is divided by another.",
        "Syntax": "MOD(Dividend, Divisor)"
    },
    {
        "Name": "MROUND",
        "Description": "Rounds number to the neares multiplicity.",
        "Syntax": "MROUND(Number, Base)"
    },
    {
        "Name": "MULTINOMIAL",
        "Description": "Returns number of multiset combinations.",
        "Syntax": "MULTINOMIAL(Number1, Number2, ...)"
    },
    {
        "Name": "ODD",
        "Description": "Rounds a positive number up to the nearest odd integer and a negative number down to the nearest odd integer.",
        "Syntax": "ODD(Number)"
    },
    {
        "Name": "PI",
        "Description": "Returns 3.14159265358979, the value of the mathematical constant PI to 14 decimal places.",
        "Syntax": "PI()"
    },
    {
        "Name": "POWER",
        "Description": "Returns a number raised to another number.",
        "Syntax": "POWER(Base, Exponent)"
    },
    {
        "Name": "PRODUCT",
        "Description": "Returns product of numbers.",
        "Syntax": "PRODUCT(Number1, Number2, ..., Number30)"
    },
    {
        "Name": "QUOTIENT",
        "Description": "Returns integer part of a division.",
        "Syntax": "QUOTIENT(Dividend, Divisor)"
    },
    {
        "Name": "RADIANS",
        "Description": "Converts degrees to radians.",
        "Syntax": "RADIANS(Number)"
    },
    {
        "Name": "RAND",
        "Description": "Returns a random number between 0 and 1.",
        "Syntax": "RAND()"
    },
    {
        "Name": "RANDBETWEEN",
        "Description": "Returns a random integer between two numbers.",
        "Syntax": "RAND(Lowerbound, Upperbound)"
    },
    {
        "Name": "ROMAN",
        "Description": "Converts number to roman form.",
        "Syntax": "ROMAN(Number[, Mode])"
    },
    {
        "Name": "ROUND",
        "Description": "Rounds a number to a certain number of decimal places.",
        "Syntax": "ROUND(Number, Count)"
    },
    {
        "Name": "ROUNDDOWN",
        "Description": "Rounds a number down, toward zero, to a certain precision.",
        "Syntax": "ROUNDDOWN(Number, Count)"
    },
    {
        "Name": "ROUNDUP",
        "Description": "Rounds a number up, away from zero, to a certain precision.",
        "Syntax": "ROUNDUP(Number, Count)"
    },
    {
        "Name": "SEC",
        "Description": "Returns the secant of the given angle (in radians).",
        "Syntax": "SEC(Number)"
    },
    {
        "Name": "SECH",
        "Description": "Returns the hyperbolic secant of the given angle (in radians).",
        "Syntax": "SEC(Number)"
    },
    {
        "Name": "SERIESSUM",
        "Description": "Evaluates series at a point.",
        "Syntax": "SERIESSUM(Number, Number, Number, Coefficients)"
    },
    {
        "Name": "SIN",
        "Description": "Returns the sine of the given angle (in radians).",
        "Syntax": "SIN(Number)"
    },
    {
        "Name": "SINH",
        "Description": "Returns the hyperbolic sine of the given value.",
        "Syntax": "SINH(Number)"
    },
    {
        "Name": "SIGN",
        "Description": "Returns sign of a number.",
        "Syntax": "SIGN(Number)"
    },
    {
        "Name": "SQRT",
        "Description": "Returns the positive square root of a number.",
        "Syntax": "SQRT(Number)"
    },
    {
        "Name": "SQRTPI",
        "Description": "Returns sqrt of number times pi.",
        "Syntax": "SQRTPI(Number)"
    },
    {
        "Name": "SUBTOTAL",
        "Description": "Computes aggregation using function specified by number.",
        "Syntax": "SUBTOTAL(Function, Number1, Number2, ... Number30)"
    },
    {
        "Name": "SUM",
        "Description": "Sums up the values of the specified cells.",
        "Syntax": "SUM(Number1, Number2, ..., Number30)"
    },
    {
        "Name": "SUMIF",
        "Description": "Sums up the values of cells that belong to the specified range and meet the specified condition.",
        "Syntax": "SUMIF(Range, Criteria, Sumrange)"
    },
    {
        "Name": "SUMIFS",
        "Description": "Sums up the values of cells that belong to the specified range and meet the specified sets of conditions.",
        "Syntax": "SUMIFS(Sum_Range , Criterion_range1 , Criterion1 [ , Criterion_range2 , Criterion2 [,...]])"
    },
    {
        "Name": "SUMPRODUCT",
        "Description": "Multiplies corresponding elements in the given arrays, and returns the sum of those products.",
        "Syntax": "SUMPRODUCT(Array1, Array2...Array30)"
    },
    {
        "Name": "SUMSQ",
        "Description": "Returns the sum of the squares of the arguments",
        "Syntax": "SUMSQ(Number1, Number2, ..., Number30)"
    },
    {
        "Name": "SUMX2MY2",
        "Description": "Returns the sum of the square differences.",
        "Syntax": "SUMX2MY2(Range1, Range2)"
    },
    {
        "Name": "SUMX2PY2",
        "Description": "Returns the sum of the square sums.",
        "Syntax": "SUMX2PY2(Range1, Range2)"
    },
    {
        "Name": "SUMXMY2",
        "Description": "Returns the sum of the square of differences.",
        "Syntax": "SUMXMY2(Range1, Range2)"
    },
    {
        "Name": "TAN",
        "Description": "Returns the tangent of the given angle (in radians).",
        "Syntax": "TAN(Number)"
    },
    {
        "Name": "TANH",
        "Description": "Returns the hyperbolic tangent of the given value.",
        "Syntax": "TANH(Number)"
    },
    {
        "Name": "TRUNC",
        "Description": "Truncates a number by removing decimal places.",
        "Syntax": "TRUNC(Number, Count)"
    },
    {
        "Name": "MMULT",
        "Description": "Calculates the array product of two arrays.",
        "Syntax": "MMULT(Array, Array)"
    },
    {
        "Name": "MEDIANPOOL",
        "Description": "Calculates a smaller range which is a median of a Window_size, in a given Range, for every Stride element.",
        "Syntax": "MEDIANPOOL(Range, Window_size, Stride)"
    },
    {
        "Name": "MAXPOOL",
        "Description": "Calculates a smaller range which is a maximum of a Window_size, in a given Range, for every Stride element.",
        "Syntax": "MAXPOOL(Range, Window_size, Stride)"
    },
    {
        "Name": "TRANSPOSE",
        "Description": "Transposes the rows and columns of an array.",
        "Syntax": "TRANSPOSE(Array)"
    },
    {
        "Name": "HF.ADD",
        "Description": "Adds two values.",
        "Syntax": "HF.ADD(Number, Number)"
    },
    {
        "Name": "HF.CONCAT",
        "Description": "Concatenates two strings.",
        "Syntax": "HF.CONCAT(String, String)"
    },
    {
        "Name": "HF.DIVIDE",
        "Description": "Divides two values.",
        "Syntax": "HF.DIVIDE(Number, Number)"
    },
    {
        "Name": "HF.EQ",
        "Description": "Tests two values for equality.",
        "Syntax": "HF.EQ(Value, Value)"
    },
    {
        "Name": "HF.LTE",
        "Description": "Tests two values for less-equal relation.",
        "Syntax": "HF.LEQ(Value, Value)"
    },
    {
        "Name": "HF.LT",
        "Description": "Tests two values for less-than relation.",
        "Syntax": "HF.LT(Value, Value)"
    },
    {
        "Name": "HF.GTE",
        "Description": "Tests two values for greater-equal relation.",
        "Syntax": "HF.GEQ(Value, Value)"
    },
    {
        "Name": "HF.GT",
        "Description": "Tests two values for greater-than relation.",
        "Syntax": "HF.GT(Value, Value)"
    },
    {
        "Name": "HF.MINUS",
        "Description": "Subtracts two values.",
        "Syntax": "HF.MINUS(Number, Number)"
    },
    {
        "Name": "HF.MULTIPLY",
        "Description": "Multiplies two values.",
        "Syntax": "HF.MULTIPLY(Number, Number)"
    },
    {
        "Name": "HF.NE",
        "Description": "Tests two values for inequality.",
        "Syntax": "HF.NE(Value, Value)"
    },
    {
        "Name": "HF.POW",
        "Description": "Computes power of two values.",
        "Syntax": "HF.POW(Number, Number)"
    },
    {
        "Name": "HF.UMINUS",
        "Description": "Negates the value.",
        "Syntax": "HF.UMINUS(Number)"
    },
    {
        "Name": "HF.UNARY_PERCENT",
        "Description": "Applies percent operator.",
        "Syntax": "HF.UNARY_PERCENT(Number)"
    },
    {
        "Name": "HF.UPLUS",
        "Description": "Applies unary plus.",
        "Syntax": "HF.UPLUS(Number)"
    },
    {
        "Name": "AVEDEV",
        "Description": "Returns the average deviation of the arguments.",
        "Syntax": "AVEDEV(Number1, Number2, ...Number30)"
    },
    {
        "Name": "AVERAGE",
        "Description": "Returns the average of the arguments.",
        "Syntax": "AVERAGE(Number1, Number2, ...Number30)"
    },
    {
        "Name": "AVERAGEA",
        "Description": "Returns the average of the arguments.",
        "Syntax": "AVERAGEA(Value1, Value2, ... Value30)"
    },
    {
        "Name": "AVERAGEIF",
        "Description": "Returns the arithmetic mean of all cells in a range that satisfy a given condition.",
        "Syntax": "AVERAGEIF(Range, Criterion [, Average_Range ])"
    },
    {
        "Name": "BESSELI",
        "Description": "Returns value of Bessel function.",
        "Syntax": "BESSELI(x, n)"
    },
    {
        "Name": "BESSELJ",
        "Description": "Returns value of Bessel function.",
        "Syntax": "BESSELJ(x, n)"
    },
    {
        "Name": "BESSELK",
        "Description": "Returns value of Bessel function.",
        "Syntax": "BESSELK(x, n)"
    },
    {
        "Name": "BESSELY",
        "Description": "Returns value of Bessel function.",
        "Syntax": "BESSELY(x, n)"
    },
    {
        "Name": "BETA.DIST",
        "Description": "Returns the denisty of Beta distribution.",
        "Syntax": "BETA.DIST(Number1, Number2, Number3, Boolean[, Number4[, Number5]])"
    },
    {
        "Name": "BETADIST",
        "Description": "Returns the denisty of Beta distribution.",
        "Syntax": "BETADIST(Number1, Number2, Number3, Boolean[, Number4[, Number5]])"
    },
    {
        "Name": "BETA.INV",
        "Description": "Returns the inverse Beta distribution value.",
        "Syntax": "BETA.INV(Number1, Number2, Number3[, Number4[, Number5]])"
    },
    {
        "Name": "BETAINV",
        "Description": "Returns the inverse of Beta distribution value.",
        "Syntax": "BETAINV(Number1, Number2, Number3[, Number4[, Number5]])"
    },
    {
        "Name": "BINOM.DIST",
        "Description": "Returns density of binomial distribution.",
        "Syntax": "BINOM.DIST(Number1, Number2, Number3, Boolean)"
    },
    {
        "Name": "BINOMDIST",
        "Description": "Returns density of binomial distribution.",
        "Syntax": "BINOMDIST(Number1, Number2, Number3, Boolean)"
    },
    {
        "Name": "BINOM.INV",
        "Description": "Returns inverse binomial distribution value.",
        "Syntax": "BINOM.INV(Number1, Number2, Number3)"
    },
    {
        "Name": "CHIDIST",
        "Description": "Returns probability of chi-square right-side distribution.",
        "Syntax": "CHIDIST(X, Degrees)"
    },
    {
        "Name": "CHIINV",
        "Description": "Returns inverse of chi-square right-side distribution.",
        "Syntax": "CHIINV(P, Degrees)"
    },
    {
        "Name": "CHIINVRT",
        "Description": "Returns inverse of chi-square right-side distribution.",
        "Syntax": "CHIINVRT(P, Degrees)"
    },
    {
        "Name": "CHISQ.DIST",
        "Description": "Returns value of chi-square distribution.",
        "Syntax": "CHISQ.DIST(X, Degrees, Mode)"
    },
    {
        "Name": "CHIDISTRT",
        "Description": "Returns probability of chi-square right-side distribution.",
        "Syntax": "CHIDISTRT(X, Degrees)"
    },
    {
        "Name": "CHISQ.DIST.RT",
        "Description": "Returns probability of chi-square right-side distribution.",
        "Syntax": "CHISQ.DIST.RT(X, Degrees)"
    },
    {
        "Name": "CHISQ.INV",
        "Description": "Returns inverse of chi-square distribution.",
        "Syntax": "CHISQ.INV.RT(P, Degrees)"
    },
    {
        "Name": "CHISQ.INV.RT",
        "Description": "Returns inverse of chi-square right-side distribution.",
        "Syntax": "CHISQ.INV.RT(P, Degrees)"
    },
    {
        "Name": "CHISQ.TEST",
        "Description": "Returns chisquared-test value for a dataset.",
        "Syntax": "CHISQ.TEST(Array1, Array2)"
    },
    {
        "Name": "CHITEST",
        "Description": "Returns chisquared-test value for a dataset.",
        "Syntax": "CHITEST(Array1, Array2)"
    },
    {
        "Name": "CONFIDENCE",
        "Description": "Returns upper confidence bound for normal distribution.",
        "Syntax": "CONFIDENCE(Alpha, Stdev, Size)"
    },
    {
        "Name": "CONFIDENCE.NORM",
        "Description": "Returns upper confidence bound for normal distribution.",
        "Syntax": "CONFIDENCE.NORM(Alpha, Stdev, Size)"
    },
    {
        "Name": "CONFIDENCE.T",
        "Description": "Returns upper confidence bound for T distribution.",
        "Syntax": "CONFIDENCE.T(Alpha, Stdev, Size)"
    },
    {
        "Name": "CORREL",
        "Description": "Returns the correlation coefficient between two data sets.",
        "Syntax": "CORREL(Data1, Data2)"
    },
    {
        "Name": "COUNT",
        "Description": "Counts how many numbers are in the list of arguments.",
        "Syntax": "COUNT(Value1, Value2, ... Value30)"
    },
    {
        "Name": "COUNTA",
        "Description": "Counts how many values are in the list of arguments.",
        "Syntax": "COUNTA(Value1, Value2, ... Value30)"
    },
    {
        "Name": "COUNTBLANK",
        "Description": "Returns the number of empty cells.",
        "Syntax": "COUNTBLANK(Range)"
    },
    {
        "Name": "COUNTIF",
        "Description": "Returns the number of cells that meet with certain criteria within a cell range.",
        "Syntax": "COUNTIF(Range, Criteria)"
    },
    {
        "Name": "COUNTIFS",
        "Description": "Returns the count of rows or columns that meet criteria in multiple ranges.",
        "Syntax": "COUNTIFS(Range1, Criterion1 [, Range2, Criterion2 [, ...]])"
    },
    {
        "Name": "COVAR",
        "Description": "Returns the covariance between two data sets, population normalized.",
        "Syntax": "COVAR(Data1, Data2)"
    },
    {
        "Name": "COVARIANCE.P",
        "Description": "Returns the covariance between two data sets, population normalized.",
        "Syntax": "COVARIANCE.P(Data1, Data2)"
    },
    {
        "Name": "COVARIANCEP",
        "Description": "Returns the covariance between two data sets, population normalized.",
        "Syntax": "COVARIANCEP(Data1, Data2)"
    },
    {
        "Name": "COVARIANCE.S",
        "Description": "Returns the covariance between two data sets, sample normalized.",
        "Syntax": "COVARIANCE.S(Data1, Data2)"
    },
    {
        "Name": "COVARIANCES",
        "Description": "Returns the covariance between two data sets, sample normalized.",
        "Syntax": "COVARIANCES(Data1, Data2)"
    },
    {
        "Name": "CRITBINOM",
        "Description": "Returns inverse binomial distribution value.",
        "Syntax": "CRITBINOM(Number1, Number2, Number3)"
    },
    {
        "Name": "DEVSQ",
        "Description": "Returns sum of squared deviations.",
        "Syntax": "DEVSQ(Number1, Number2, ...Number30)"
    },
    {
        "Name": "EXPON.DIST",
        "Description": "Returns density of a exponential distribution.",
        "Syntax": "EXPON.DIST(Number1, Number2, Boolean)"
    },
    {
        "Name": "EXPONDIST",
        "Description": "Returns density of a exponential distribution.",
        "Syntax": "EXPONDIST(Number1, Number2, Boolean)"
    },
    {
        "Name": "FDIST",
        "Description": "Returns probability of F right-side distribution.",
        "Syntax": "FDIST(X, Degree1, Degree2)"
    },
    {
        "Name": "FINV",
        "Description": "Returns inverse of F right-side distribution.",
        "Syntax": "FINV(P, Degree1, Degree2)"
    },
    {
        "Name": "F.DIST",
        "Description": "Returns value of F distribution.",
        "Syntax": "F.DIST(X, Degree1, Degree2, Mode)"
    },
    {
        "Name": "F.DIST.RT",
        "Description": "Returns probability of F right-side distribution.",
        "Syntax": "F.DIST.RT(X, Degree1, Degree2)"
    },
    {
        "Name": "FDISTRT",
        "Description": "Returns probability of F right-side distribution.",
        "Syntax": "FDISTRT(X, Degree1, Degree2)"
    },
    {
        "Name": "F.INV",
        "Description": "Returns inverse of F distribution.",
        "Syntax": "F.INV.RT(P, Degree1, Degree2)"
    },
    {
        "Name": "F.INV.RT",
        "Description": "Returns inverse of F right-side distribution.",
        "Syntax": "F.INV.RT(P, Degree1, Degree2)"
    },
    {
        "Name": "FINVRT",
        "Description": "Returns inverse of F right-side distribution.",
        "Syntax": "FINVRT(P, Degree1, Degree2)"
    },
    {
        "Name": "FISHER",
        "Description": "Returns Fisher transformation value.",
        "Syntax": "FISHER(Number)"
    },
    {
        "Name": "FISHERINV",
        "Description": "Returns inverse Fischer transformation value.",
        "Syntax": "FISHERINV(Number)"
    },
    {
        "Name": "F.TEST",
        "Description": "Returns f-test value for a dataset.",
        "Syntax": "Z.TEST(Array1, Array2)"
    },
    {
        "Name": "FTEST",
        "Description": "Returns f-test value for a dataset.",
        "Syntax": "ZTEST(Array1, Array2)"
    },
    {
        "Name": "GAMMA",
        "Description": "Returns value of Gamma function.",
        "Syntax": "GAMMA(Number)"
    },
    {
        "Name": "GAMMA.DIST",
        "Description": "Returns density of Gamma distribution.",
        "Syntax": "GAMMA.DIST(Number1, Number2, Number3, Boolean)"
    },
    {
        "Name": "GAMMADIST",
        "Description": "Returns density of Gamma distribution.",
        "Syntax": "GAMMADIST(Number1, Number2, Number3, Boolean)"
    },
    {
        "Name": "GAMMALN",
        "Description": "Returns natural logarithm of Gamma function.",
        "Syntax": "GAMMALN(Number)"
    },
    {
        "Name": "GAMMALN.PRECISE",
        "Description": "Returns natural logarithm of Gamma function.",
        "Syntax": "GAMMALN.PRECISE(Number)"
    },
    {
        "Name": "GAMMA.INV",
        "Description": "Returns inverse Gamma distribution value.",
        "Syntax": "GAMMA.INV(Number1, Number2, Number3)"
    },
    {
        "Name": "GAMMAINV",
        "Description": "Returns inverse Gamma distribution value.",
        "Syntax": "GAMMAINV(Number1, Number2, Number3)"
    },
    {
        "Name": "GAUSS",
        "Description": "Returns the probability of gaussian variable fall more than this many times standard deviation from mean.",
        "Syntax": "GAUSS(Number)"
    },
    {
        "Name": "GEOMEAN",
        "Description": "Returns the geometric average.",
        "Syntax": "GEOMEAN(Number1, Number2, ...Number30)"
    },
    {
        "Name": "HARMEAN",
        "Description": "Returns the harmonic average.",
        "Syntax": "HARMEAN(Number1, Number2, ...Number30)"
    },
    {
        "Name": "HYPGEOMDIST",
        "Description": "Returns density of hypergeometric distribution.",
        "Syntax": "HYPGEOMDIST(Number1, Number2, Number3, Number4, Boolean)"
    },
    {
        "Name": "HYPGEOM.DIST",
        "Description": "Returns density of hypergeometric distribution.",
        "Syntax": "HYPGEOM.DIST(Number1, Number2, Number3, Number4, Boolean)"
    },
    {
        "Name": "LARGE",
        "Description": "Returns k-th largest value in a range.",
        "Syntax": "LARGE(Range, K)"
    },
    {
        "Name": "LOGNORM.DIST",
        "Description": "Returns density of lognormal distribution.",
        "Syntax": "LOGNORM.DIST(X, Mean, Stddev, Mode)"
    },
    {
        "Name": "LOGNORMDIST",
        "Description": "Returns density of lognormal distribution.",
        "Syntax": "LOGNORMDIST(X, Mean, Stddev, Mode)"
    },
    {
        "Name": "LOGNORM.INV",
        "Description": "Returns value of inverse lognormal distribution.",
        "Syntax": "LOGNORM.INV(P, Mean, Stddev)"
    },
    {
        "Name": "LOGNORMINV",
        "Description": "Returns value of inverse lognormal distribution.",
        "Syntax": "LOGNORMINV(P, Mean, Stddev)"
    },
    {
        "Name": "LOGINV",
        "Description": "Returns value of inverse lognormal distribution.",
        "Syntax": "LOGINV(P, Mean, Stddev)"
    },
    {
        "Name": "MAX",
        "Description": "Returns the maximum value in a list of arguments.",
        "Syntax": "MAX(Number1, Number2, ...Number30)"
    },
    {
        "Name": "MAXA",
        "Description": "Returns the maximum value in a list of arguments.",
        "Syntax": "MAXA(Value1, Value2, ... Value30)"
    },
    {
        "Name": "MAXIFS",
        "Description": "Returns the maximum value of the cells in a range that meet a set of criteria.",
        "Syntax": "MAXIFS(Max_Range , Criterion_range1 , Criterion1 [ , Criterion_range2 , Criterion2 [,...]])"
    },
    {
        "Name": "MEDIAN",
        "Description": "Returns the median of a set of numbers.",
        "Syntax": "MEDIAN(Number1, Number2, ...Number30)"
    },
    {
        "Name": "MIN",
        "Description": "Returns the minimum value in a list of arguments.",
        "Syntax": "MIN(Number1, Number2, ...Number30)"
    },
    {
        "Name": "MINA",
        "Description": "Returns the minimum value in a list of arguments.",
        "Syntax": "MINA(Value1, Value2, ... Value30)"
    },
    {
        "Name": "MINIFS",
        "Description": "Returns the minimum value of the cells in a range that meet a set of criteria.",
        "Syntax": "MINIFS(Min_Range , Criterion_range1 , Criterion1 [ , Criterion_range2 , Criterion2 [,...]])"
    },
    {
        "Name": "NEGBINOM.DIST",
        "Description": "Returns density of negative binomial distribution.",
        "Syntax": "NEGBINOM.DIST(Number1, Number2, Number3, Mode)"
    },
    {
        "Name": "NEGBINOMDIST",
        "Description": "Returns density of negative binomial distribution.",
        "Syntax": "NEGBINOMDIST(Number1, Number2, Number3, Mode)"
    },
    {
        "Name": "NORM.DIST",
        "Description": "Returns density of normal distribution.",
        "Syntax": "NORM.DIST(X, Mean, Stddev, Mode)"
    },
    {
        "Name": "NORMDIST",
        "Description": "Returns density of normal distribution.",
        "Syntax": "NORMDIST(X, Mean, Stddev, Mode)"
    },
    {
        "Name": "NORM.S.DIST",
        "Description": "Returns density of normal distribution.",
        "Syntax": "NORM.S.DIST(X, Mode)"
    },
    {
        "Name": "NORMDIST",
        "Description": "Returns density of normal distribution.",
        "Syntax": "NORMSDIST(X, Mode)"
    },
    {
        "Name": "NORM.INV",
        "Description": "Returns value of inverse normal distribution.",
        "Syntax": "NORM.INV(P, Mean, Stddev)"
    },
    {
        "Name": "NORMINV",
        "Description": "Returns value of inverse normal distribution.",
        "Syntax": "NORMINV(P, Mean, Stddev)"
    },
    {
        "Name": "NORM.S.INV",
        "Description": "Returns value of inverse normal distribution.",
        "Syntax": "NORM.S.INV(P)"
    },
    {
        "Name": "NORMSINV",
        "Description": "Returns value of inverse normal distribution.",
        "Syntax": "NORMSINV(P)"
    },
    {
        "Name": "PEARSON",
        "Description": "Returns the correlation coefficient between two data sets.",
        "Syntax": "PEARSON(Data1, Data2)"
    },
    {
        "Name": "PHI",
        "Description": "Returns probability densitity of normal distribution.",
        "Syntax": "PHI(X)"
    },
    {
        "Name": "POISSON",
        "Description": "Returns density of Poisson distribution.",
        "Syntax": "POISSON(X, Mean, Mode)"
    },
    {
        "Name": "POISSON.DIST",
        "Description": "Returns density of Poisson distribution.",
        "Syntax": "POISSON.DIST(X, Mean, Mode)"
    },
    {
        "Name": "POISSONDIST",
        "Description": "Returns density of Poisson distribution.",
        "Syntax": "POISSONDIST(X, Mean, Mode)"
    },
    {
        "Name": "RSQ",
        "Description": "Returns the squared correlation coefficient between two data sets.",
        "Syntax": "RSQ(Data1, Data2)"
    },
    {
        "Name": "SKEW",
        "Description": "Returns skeweness of a sample.",
        "Syntax": "SKEW(Number1, Number2, ...Number30)"
    },
    {
        "Name": "SKEW.P",
        "Description": "Returns skeweness of a population.",
        "Syntax": "SKEW.P(Number1, Number2, ...Number30)"
    },
    {
        "Name": "SKEWP",
        "Description": "Returns skeweness of a population.",
        "Syntax": "SKEWP(Number1, Number2, ...Number30)"
    },
    {
        "Name": "SLOPE",
        "Description": "Returns the slope of a linear regression line.",
        "Syntax": "SLOPE(Array1, Array2)"
    },
    {
        "Name": "SMALL",
        "Description": "Returns k-th smallest value in a range.",
        "Syntax": "SMALL(Range, K)"
    },
    {
        "Name": "STANDARDIZE",
        "Description": "Returns normalized value wrt expected value and standard deviation.",
        "Syntax": "STANDARDIZE(X, Mean, Stddev)"
    },
    {
        "Name": "STDEV",
        "Description": "Returns standard deviation of a sample.",
        "Syntax": "STDEV(Value1, Value2, ... Value30)"
    },
    {
        "Name": "STDEVA",
        "Description": "Returns standard deviation of a sample.",
        "Syntax": "STDEVA(Value1, Value2, ... Value30)"
    },
    {
        "Name": "STDEVP",
        "Description": "Returns standard deviation of a population.",
        "Syntax": "STDEVP(Value1, Value2, ... Value30)"
    },
    {
        "Name": "STDEV.P",
        "Description": "Returns standard deviation of a population.",
        "Syntax": "STDEV.P(Value1, Value2, ... Value30)"
    },
    {
        "Name": "STDEVPA",
        "Description": "Returns standard deviation of a population.",
        "Syntax": "STDEVPA(Value1, Value2, ... Value30)"
    },
    {
        "Name": "STDEV.S",
        "Description": "Returns standard deviation of a sample.",
        "Syntax": "STDEV.S(Value1, Value2, ... Value30)"
    },
    {
        "Name": "STDEVS",
        "Description": "Returns standard deviation of a sample.",
        "Syntax": "STDEVS(Value1, Value2, ... Value30)"
    },
    {
        "Name": "STEYX",
        "Description": "Returns standard error for predicted of the predicted y value for each x value.",
        "Syntax": "STEYX(Array1, Array2)"
    },
    {
        "Name": "TDIST",
        "Description": "Returns density of Student-t distribution, both-sided or right-tailed.",
        "Syntax": "TDIST(X, Degrees, Mode)"
    },
    {
        "Name": "T.DIST",
        "Description": "Returns density of Student-t distribution.",
        "Syntax": "T.DIST(X, Degrees, Mode)"
    },
    {
        "Name": "T.DIST.2T",
        "Description": "Returns density of Student-t distribution, both-sided.",
        "Syntax": "T.DIST.2T(X, Degrees)"
    },
    {
        "Name": "TDIST2T",
        "Description": "Returns density of Student-t distribution, both-sided.",
        "Syntax": "TDIST2T(X, Degrees)"
    },
    {
        "Name": "T.DIST.RT",
        "Description": "Returns density of Student-t distribution, right-tailed.",
        "Syntax": "T.DIST.RT(X, Degrees)"
    },
    {
        "Name": "TDISTRT",
        "Description": "Returns density of Student-t distribution, right-tailed.",
        "Syntax": "TDISTRT(X, Degrees)"
    },
    {
        "Name": "TINV",
        "Description": "Returns inverse Student-t distribution, both-sided.",
        "Syntax": "TINV(P, Degrees)"
    },
    {
        "Name": "T.INV",
        "Description": "Returns inverse Student-t distribution.",
        "Syntax": "T.INV(P, Degrees)"
    },
    {
        "Name": "T.INV.2T",
        "Description": "Returns inverse Student-t distribution, both-sided.",
        "Syntax": "T.INV.2T(P, Degrees)"
    },
    {
        "Name": "TINV2T",
        "Description": "Returns inverse Student-t distribution, both-sided.",
        "Syntax": "TINV2T(P, Degrees)"
    },
    {
        "Name": "TTEST",
        "Description": "Returns t-test value for a dataset.",
        "Syntax": "TTEST(Array1, Array2)"
    },
    {
        "Name": "T.TEST",
        "Description": "Returns t-test value for a dataset.",
        "Syntax": "T.TEST(Array1, Array2)"
    },
    {
        "Name": "VAR",
        "Description": "Returns variance of a sample.",
        "Syntax": "VAR(Value1, Value2, ... Value30)"
    },
    {
        "Name": "VARA",
        "Description": "Returns variance of a sample.",
        "Syntax": "VARA(Value1, Value2, ... Value30)"
    },
    {
        "Name": "VARP",
        "Description": "Returns variance of a population.",
        "Syntax": "VARP(Value1, Value2, ... Value30)"
    },
    {
        "Name": "VAR.P",
        "Description": "Returns variance of a population.",
        "Syntax": "VAR.P(Value1, Value2, ... Value30)"
    },
    {
        "Name": "VARPA",
        "Description": "Returns variance of a population.",
        "Syntax": "VARPA(Value1, Value2, ... Value30)"
    },
    {
        "Name": "VAR.S",
        "Description": "Returns variance of a sample.",
        "Syntax": "VAR.S(Value1, Value2, ... Value30)"
    },
    {
        "Name": "VARS",
        "Description": "Returns variance of a sample.",
        "Syntax": "VARS(Value1, Value2, ... Value30)"
    },
    {
        "Name": "WEIBULL",
        "Description": "Returns density of Weibull distribution.",
        "Syntax": "WEIBULL(Number1, Number2, Number3, Boolean)"
    },
    {
        "Name": "WEIBULL.DIST",
        "Description": "Returns density of Weibull distribution.",
        "Syntax": "WEIBULL.DIST(Number1, Number2, Number3, Boolean)"
    },
    {
        "Name": "WEIBULLDIST",
        "Description": "Returns density of Weibull distribution.",
        "Syntax": "WEIBULLDIST(Number1, Number2, Number3, Boolean)"
    },
    {
        "Name": "Z.TEST",
        "Description": "Returns z-test value for a dataset.",
        "Syntax": "Z.TEST(Array, X[, Sigma])"
    },
    {
        "Name": "ZTEST",
        "Description": "Returns z-test value for a dataset.",
        "Syntax": "ZTEST(Array, X[, Sigma])"
    },
    {
        "Name": "CHAR",
        "Description": "Converts a number into a character according to the current code table.",
        "Syntax": "CHAR(Number)"
    },
    {
        "Name": "CLEAN",
        "Description": "Returns text that has been \"cleaned\" of line breaks and other non-printable characters.",
        "Syntax": "CLEAN(\"Text\")"
    },
    {
        "Name": "CODE",
        "Description": "Returns a numeric code for the first character in a text string.",
        "Syntax": "CODE(\"Text\")"
    },
    {
        "Name": "CONCATENATE",
        "Description": "Combines several text strings into one string.",
        "Syntax": "CONCATENATE(\"Text1\", ..., \"Text30\")"
    },
    {
        "Name": "EXACT",
        "Description": "Returns TRUE if both text strings are exactly the same.",
        "Syntax": "EXACT(Text, Text)"
    },
    {
        "Name": "FIND",
        "Description": "Returns the location of one text string inside another.",
        "Syntax": "FIND( \"Text1\", \"Text2\"[, Number])"
    },
    {
        "Name": "LEFT",
        "Description": "Extracts a given number of characters from the left side of a text string.",
        "Syntax": "LEFT(\"Text\", Number)"
    },
    {
        "Name": "LEN",
        "Description": "Returns length of a given text.",
        "Syntax": "LEN(\"Text\")"
    },
    {
        "Name": "LOWER",
        "Description": "Returns text converted to lowercase.",
        "Syntax": "LOWER(Text)"
    },
    {
        "Name": "MID",
        "Description": "Returns substring of a given length starting from Start_position.",
        "Syntax": "MID(Text, Start_position, Length)"
    },
    {
        "Name": "PROPER",
        "Description": "Capitalizes words given text string.",
        "Syntax": "PROPER(\"Text\")"
    },
    {
        "Name": "REPLACE",
        "Description": "Replaces substring of a text of a given length that starts at given position.",
        "Syntax": "REPLACE(Text, Start_position, Length, New_text)"
    },
    {
        "Name": "REPT",
        "Description": "Repeats text a given number of times.",
        "Syntax": "REPT(\"Text\", Number)"
    },
    {
        "Name": "RIGHT",
        "Description": "Extracts a given number of characters from the right side of a text string.",
        "Syntax": "RIGHT(\"Text\", Number)"
    },
    {
        "Name": "SEARCH",
        "Description": "Returns the location of Search_string inside Text. Case-insensitive. Allows the use of wildcards.",
        "Syntax": "SEARCH(Search_string, Text[, Start_position])"
    },
    {
        "Name": "SPLIT",
        "Description": "Divides the provided text using the space character as a separator and returns the substring at the zero-based position specified by the second argument.\nSPLIT(\"Lorem ipsum\", 0) -> \"Lorem\"\nSPLIT(\"Lorem ipsum\", 1) -> \"ipsum\"",
        "Syntax": "SPLIT(Text, Index)"
    },
    {
        "Name": "SUBSTITUTE",
        "Description": "Returns string where occurrences of Old_text are replaced by New_text. Replaces only specific occurrence if last parameter is provided.",
        "Syntax": "SUBSTITUTE(Text, Old_text, New_text, [Occurrence])"
    },
    {
        "Name": "T",
        "Description": "Returns text if given value is text, empty string otherwise.",
        "Syntax": "T(Value)"
    },
    {
        "Name": "TEXT",
        "Description": "Converts a number into text according to a given format.\n\nBy default, accepts the same formats that can be passed to the dateFormats option, but can be further customized with the stringifyDateTime option.",
        "Syntax": "TEXT(Number, Format)"
    },
    {
        "Name": "TRIM",
        "Description": "Strips extra spaces from text.",
        "Syntax": "TRIM(\"Text\")"
    },
    {
        "Name": "UNICHAR",
        "Description": "Returns the character created by using provided code point.",
        "Syntax": "UNICHAR(Number)"
    },
    {
        "Name": "UNICODE",
        "Description": "Returns the Unicode code point of a first character of a text.",
        "Syntax": "UNICODE(Text)"
    },
    {
        "Name": "UPPER",
        "Description": "Returns text converted to uppercase.",
        "Syntax": "UPPER(Text)"
    }
]

export function FormulaList() {
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const ref = useRef<HTMLDivElement>(null)
    const selectStart = useSelector((state: RootState) => state.selectStart.value)

    const keyDownEventHandler = useCallback((e: KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            const elem = document.getElementById(FORMULAS[Math.min(selectedIndex + 1, FORMULAS.length - 1)].Description + FORMULAS[Math.min(selectedIndex + 1, FORMULAS.length - 1)].Syntax)
            if (elem) {
                elem.scrollIntoView()
            }
            setSelectedIndex(Math.min(selectedIndex + 1, FORMULAS.length - 1))
        }
        if (e.key === "ArrowUp") {
            e.preventDefault()
            const elem = document.getElementById(FORMULAS[Math.max(selectedIndex - 1, 0)].Description + FORMULAS[Math.max(selectedIndex - 1, 0)].Syntax)
            if (elem) {
                elem.scrollIntoView()
            }
            setSelectedIndex(Math.max(selectedIndex - 1, 0))
        }
    }, [selectedIndex])

    useEffect(() => {
        document.addEventListener("keydown", keyDownEventHandler)

        return () => {
            document.removeEventListener("keydown", keyDownEventHandler)
        }
    }, [keyDownEventHandler])


    return (
        FORMULAS.filter(x => x.Name.startsWith(selectStart.text.slice(1))).length !== 0 && <div ref={ref} className="w-[250px] absolute hidden z-[6000]" style={{
            top: selectStart.bottom,
            left: selectStart.left,
            display: selectStart.display
        }}>
            <div className="overflow-y-scroll h-[200px]">
                {FORMULAS.filter(x => x.Name.startsWith(selectStart.text.slice(1))).map((x, i) => (
                    <div key={x.Description + x.Syntax}
                        id={x.Description + x.Syntax}
                        onMouseOver={() => {
                            setSelectedIndex(i)
                            // ref.current?.style.display = "none"
                            const elem = document.getElementById(selectStart.id) as HTMLTextAreaElement
                            if (elem) {
                                elem.value = `=${x.Name}()`
                            }
                        }}
                        className="p-1 hover:cursor-pointer"
                        style={{
                            backgroundColor: selectedIndex === i ? "#E2E8F0" : "white"
                        }}
                    >
                        <span className="text-sm block mb-1">{x.Name}</span>
                        {selectedIndex === i && <span className="block text-xs mb-1"><strong>Description: </strong>{x.Description}</span>}
                        {selectedIndex === i && <span className="block text-xs"><strong>Syntax: </strong>{x.Syntax}</span>}
                    </div>
                ))}
            </div>
            <div className="mt-1 p-1 bg-slate-300 flex gap-2">
                <span className="ml-1">Tab to accept</span>
                <div className="flex justify-center mt-auto mb-auto">
                    <FaArrowUp />
                    <FaArrowDown />
                </div>
                <span>to navigate</span>
            </div>
        </div>
    )
}