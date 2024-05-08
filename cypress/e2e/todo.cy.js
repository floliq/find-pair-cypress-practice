/// <reference types="cypress" />

describe('Игра найди пару', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('В начальном состоянии игра должна иметь поле четыре на четыре клетки, в каждой клетке цифра должна быть невидима', () => {
    cy.contains('Начать игру').click();
    cy.get('.game__cards').children().should('have.length', 16);
    cy.get('.game__cards').children().should('have.not.class', 'flip');
  });

  it('Нажать на одну произвольную карточку. Убедиться, что она осталась открытой', () => {
    cy.contains('Начать игру').click();
    cy.get('.game__cards').children().eq(3).click();
    cy.get('.game__cards').children().eq(3).should('have.class', 'flip');
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это не пара, то повторять со следующей карточкой, пока не будет найдена пара. Проверить, что найденная пара карточек осталась видимой.', () => {
    cy.contains('Начать игру').click();
    cy.wait(1000);
    let counter = 1;
    function checkPair() {
      const firstCard = cy.get('.game__cards').children().eq(0);
      const secondCard = cy.get('.game__cards').children().eq(counter);
      firstCard.click();
      secondCard.click();
      firstCard.find('.game__face').invoke('text').then((firstValue) => {
        secondCard.find('.game__face').invoke('text').then((secondValue) => {
          if (firstValue === secondValue) {
            cy.wait(1000);
            cy.get('.game__cards').children().eq(0).should('have.class', 'flip');
            cy.get('.game__cards').children().eq(counter).should('have.class', 'flip');
          } else {
            counter++;
            cy.wait(1000);
            checkPair();
          }
        });
      });
    }
    checkPair();
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это пара, то повторять со следующими двумя карточками, пока не найдутся непарные карточки. Проверить, что после нажатия на третью карточку две несовпадающие карточки становятся закрытыми.', () => {
    cy.contains('Начать игру').click();
    cy.wait(1000);
    let cardNum = 0;
    function checkNotPair() {
      const firstCard = cy.get('.game__cards').children().eq(cardNum);
      const secondCard = cy.get('.game__cards').children().eq(cardNum + 1);
      firstCard.click();
      secondCard.click();
      firstCard.find('.game__face').invoke('text').then((firstValue) => {
        secondCard.find('.game__face').invoke('text').then((secondValue) => {
          if (firstValue === secondValue) {
            cardNum += 2;
            cy.wait(1000);
            checkNotPair();
          } else {
            const thirdCard = cy.get('.game__cards').children().eq(cardNum + 2);
            console.log(thirdCard);
            thirdCard.click();
            cy.get('.game__cards').children().eq(cardNum).should('have.class', 'flip');
            cy.get('.game__cards').children().eq(cardNum + 1).should('have.class', 'flip');
            cy.get('.game__cards').children().eq(cardNum + 2).should('not.have.class', 'flip');
          }
        });
      });
    }
    checkNotPair();
  });
});
