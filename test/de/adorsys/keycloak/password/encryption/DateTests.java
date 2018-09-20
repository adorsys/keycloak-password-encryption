package de.adorsys.keycloak.password.encryption;

import static org.junit.Assert.assertTrue;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

import org.junit.Test;

public class DateTests {
	
	
	@Test
	public void minuteBetweenDatesShouldBe2() {
		ZonedDateTime now = ZonedDateTime.now();
		ZonedDateTime from = now.minusMinutes(2);
		long between = ChronoUnit.MINUTES.between(from, now);
		assertTrue(between >1);
	}
	
	
}
