document.addEventListener('DOMContentLoaded', function() {
  // Formats diagonal linear equations to follow human conventions
  const formatDiagLinearEqn = function(slope, mathjsYIntercept) {
    const slope = mathToString(slope);
    if (mathjsYIntercept.n === 0) {
      return `y = ${slope} x`;
    }
    if (mathjsYIntercept.s === 1) {
      const yIntercept = mathToString(mathjsYIntercept);

      return `y = ${coeffCheck(slope, 'x')} + ${yIntercept}`;
    } else {
      const posYIntercept = mathToString(math.abs(mathjsYIntercept));

      return `y = ${coeffCheck(slope, 'x')} - ${posYIntercept}`;
    }
  };

  // Function factory for generating linear equations on a cartesian plane
  const getLinearEqn = function() {
    const pt1 = getPoint(getRandomInt(-10, 10), getRandomInt(-10, 10));
    const pt2 = getPoint(getRandomInt(-10, 10), getRandomInt(-10, 10));

    return {
      pt1,
      pt2,
      slope() {
        if (this.pt1.x === this.pt2.x) {
          return Infinity;
        }

        return math.fraction((this.pt2.y - this.pt1.y) /
                             (this.pt2.x - this.pt1.x));
      },
      yIntercept() {
        return math.subtract(
          this.pt2.y, math.multiply(this.slope(), this.pt2.x));
      },
      xIntercept() {
        if (this.slope() === Infinity) {
          return this.pt2.x;
        }

        return math.divide(math.unaryMinus(this.yIntercept()), this.slope());
      },
      eqn() {
        const slope = mathToString(this.slope());

        switch (slope) {
          case 'Infinity':
            return `x = ${this.pt1.x}`;
          case '0':
            return `y = ${this.pt1.y}`;
          default:
            return formatDiagLinearEqn(this.slope(), this.yIntercept());
        }
      }
    };
  };

  // Function factory for lines perpendicular to the original
  const getPerpendicularLine = function(originalLine) {
    const slope = math.divide(1, originalLine.slope());
    const yIntercept = math.fraction(getRandomInt(-20, 20));

    return {
      slope() {
        return math.divide(1, originalLine.slope());
      },
      yIntercept() {
        return math.fraction(getRandomInt(-20, 20));
      },
      eqn() {
        return formatDiagLinearEqn(
          mathToString(this.slope()), this.yIntercept());
      },
      eqnWithSameYInt() {
        return formatDiagLinearEqn(mathToString(this.slope()),
                                    originalLine.yIntercept());
      }
    };
  };

  const getParallelLine = function(originalLine) {

  }

  const ParallelLine = function(originalLine) {
    this.slope = function() {
      return originalLine.slope();
    };
    this.eqn = function() {
      let yIntercept = math.fraction(getRandomInt(-20, 20));

      if (yIntercept === originalLine.yIntercept()) {
        yIntercept = getRandomInt(-20, 20);
      }

      return formatDiagLinearEqn(mathToString(this.slope()), yIntercept);
    };
  };
});
