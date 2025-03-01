package ro.expensestracker.security;

import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2ClientService {

    private final OAuth2AuthorizedClientService authorizedClientService;

    public CustomOAuth2ClientService(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
    }

    public OAuth2AuthorizedClient loadAuthorizedClient(String registrationId, String principalName) {
        return authorizedClientService.loadAuthorizedClient(registrationId, principalName);
    }
}
