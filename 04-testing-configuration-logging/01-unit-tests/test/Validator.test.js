const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe("Type checking" , () => {
      it('Check that type is valid', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });
  
        const errors = validator.validate({ age: [1, 2]});
  
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got object');

        // if Type checking OK => Check name type
        
        describe("Name checking", () => {
          it('Check type of name', () => {
            const validator = new Validator({
              name: {
                type: 'string',
                min: 5,
                max: 10,
              },
            });
      
            const errors = validator.validate({ name: 12});
      
            expect(errors).to.have.length(1);
            expect(errors[0]).to.have.property('field').and.to.be.equal('name');
            expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
            
            // if Name type checking OK => Check Name range and unexpected symbols

            describe("Check name range", () => {
              it('Check too short name', () => {
                const validator = new Validator({
                  name: {
                    type: 'string',
                    min: 5,
                    max: 10,
                  },
                });
          
                const errors = validator.validate({ name: "Asdf" });
          
                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('name');
                expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 4');
              });
              it('Check too long name', () => {
                const validator = new Validator({
                  name: {
                    type: 'string',
                    min: 5,
                    max: 10,
                  },
                });
          
                const errors = validator.validate({ name: "qwertyasdfe" });
          
                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('name');
                expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 11');
              });
              it('Check unexpected symbols in name', () => {
                const validator = new Validator({
                  name: {
                    type: 'string',
                    min: 5,
                    max: 10,
                  },
                });
          
                const errors = validator.validate({ name: "asdf12/*-" });
          
                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('name');
                expect(errors[0]).to.have.property('error').and.to.be.equal('unexpected symbols, got asdf12/*-');
              });
            });
          });
        });        

        // if Type checking OK => Check age type
        
        describe("Age checking", () => {
          it('Check type of age', () => {
            const validator = new Validator({
              age: {
                type: 'number',
                min: 18,
                max: 27,
              },
            });
      
            const errors = validator.validate({ age: "asdf"});
      
            expect(errors).to.have.length(1);
            expect(errors[0]).to.have.property('field').and.to.be.equal('age');
            expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
            
            // if Age type checking OK => Check age range & age is integer

            describe("Check age range", () => {
              it('Check too little age', () => {
                const validator = new Validator({
                  age: {
                    type: 'number',
                    min: 18,
                    max: 27,
                  },
                });
          
                const errors = validator.validate({ age: 17 });
          
                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('age');
                expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
              });
              it('Check too big age', () => {
                const validator = new Validator({
                  age: {
                    type: 'number',
                    min: 18,
                    max: 27,
                  },
                });
          
                const errors = validator.validate({ age: 28 });
          
                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('age');
                expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 18, got 28');
              });
              it('Check that age is integer', () => {
                const validator = new Validator({
                  age: {
                    type: 'number',
                    min: 18,
                    max: 27,
                  },
                });
          
                const errors = validator.validate({ age: 18.99999 });
          
                expect(errors).to.have.length(1);
                expect(errors[0]).to.have.property('field').and.to.be.equal('age');
                expect(errors[0]).to.have.property('error').and.to.be.equal('numeric value is not integer - 18.99999');
              });
            });
          });
        });
      });
    });
  });
});