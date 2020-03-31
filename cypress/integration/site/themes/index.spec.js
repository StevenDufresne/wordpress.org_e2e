/// <reference types='Cypress' />

context('Themes', () => {
	beforeEach(() => {
		cy.visit('/themes');
	});

	it('it should redirect and add a slash to url', () => {
		const url = '/themes/browse/new';
		cy.visit(url);
		cy.location('pathname').should('eq', url + '/');
	});

	it('it should load full count on load', () => {
		const url = '/themes/browse/new';
		cy.window().then((win) => {
			const { postsPerPage } = win._wpThemeSettings.settings;
			const { total } = win._wpThemeSettings.query;

			cy.get('.theme-count')
				.invoke('text')
				.then((x) => {
					const num = +x.replace(',', '');
					expect(num).to.equal(total);
				});
		});
	});

	it('it should add the correct query to the settings variable without page in url', () => {
		cy.window().then((win) => {
			const { request } = win._wpThemeSettings.query;
			expect(request).to.eql({ browse: 'popular', page: 1 });
		});
	});

	it('it should add the correct query to the settings variable with page in url', () => {
		cy.visit('/themes/browse/new/page/2');
		cy.window().then((win) => {
			const { request } = win._wpThemeSettings.query;
			expect(request).to.eql({ browse: 'new', page: 2 });
		});
	});

	it('it should fetch `new` items', () => {
		cy.visit('/themes/browse/popular');
		cy.get('[data-sort="new"]').click();

		cy.window().then((win) => {
			const themes = cy.get('.theme');

			expect(
				themes.should(
					'have.length',
					win._wpThemeSettings.settings.postsPerPage
				)
			);
		});
	});

	it('it should fetch `popular` items', () => {
		cy.visit('/themes/browse/new');
		cy.get('[data-sort="popular"]').click();

		cy.window().then((win) => {
			const themes = cy.get('.theme');

			expect(
				themes.should(
					'have.length',
					win._wpThemeSettings.settings.postsPerPage
				)
			);
		});
	});

	it('it should show single view on theme click', () => {
		cy.visit('/themes/browse/popular');
		cy.get('[data-sort="new"]').click();
		cy.get('.theme:first-child').click();
		cy.get('.theme-overlay').should('be.visible');
	});

	it('it should load more themes on scroll', () => {
		cy.visit('/themes/browse/popular');
		cy.get('[data-sort="new"]').click();

		cy.get('#wporg-footer').scrollIntoView({ duration: 2000 });

		cy.window().then((win) => {
			const themes = cy.get('.theme');

			expect(
				themes.should(
					'have.length.above',
					win._wpThemeSettings.settings.postsPerPage
				)
			);
		});
	});

	it('it should not show the paging alert element', () => {
		cy.get('#viewing-paged-alert').should('be.hidden');
	});

	it('it should show the paging alert element', () => {
		cy.visit('/themes/browse/new/page/2');
		cy.get('#viewing-paged-alert').should('be.visible');
	});
});
